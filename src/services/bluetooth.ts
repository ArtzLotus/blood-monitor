// src/services/bluetooth.ts

export const BLE_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
export const BLE_PROFILE_CHAR_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // Web kirim data profil -> ESP32
export const BLE_DATA_CHAR_UUID = 'cba1d466-344c-4be3-ab3f-189f80dd7518';    // ESP32 kirim hasil tensi -> Web

export interface BleMeasurementPayload {
  sysBP: number;
  diaBP: number;
  bpm: number;
  probability: number;
  riskLevel: 'NORMAL' | 'HIGH';
  status: string;
}

export interface BleUserProfilePayload {
  age: number;
  isMale: boolean;
  bmi: number;
  isSmoker: boolean;
}

class BluetoothService {
  private device: any = null;
  private server: any = null;
  private profileChar: any = null;
  private dataChar: any = null;
  private onConnectionChangeCallback: ((connected: boolean) => void) | null = null;

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  // Daftarkan callback untuk mendeteksi perubahan koneksi
  public onConnectionChange(callback: (connected: boolean) => void) {
    this.onConnectionChangeCallback = callback;
  }

  public isConnected(): boolean {
    return !!(this.device && this.device.gatt?.connected);
  }

  // src/services/bluetooth.ts (bagian connect)

public async connect(): Promise<boolean> {
  if (!this.isSupported()) {
    throw new Error('Web Bluetooth API tidak didukung di browser ini. Gunakan Chrome / Edge.');
  }

  try {
    // 1. Request device
    this.device = await (navigator as any).bluetooth.requestDevice({
      filters: [{ namePrefix: 'ESP32' }, { namePrefix: 'BP' }],
      optionalServices: [BLE_SERVICE_UUID],
    });

    if (!this.device) return false;

    // 2. Pasang listener disconnect
    this.device.addEventListener('gattserverdisconnected', () => {
      console.warn('[BLE] Event gattserverdisconnected terpanggil');
      this.server = null;
      this.profileChar = null;
      this.dataChar = null;
      if (this.onConnectionChangeCallback) {
        this.onConnectionChangeCallback(false);
      }
    });

    // 3. Connect ke GATT Server
    this.server = await this.device.gatt?.connect();
    if (!this.server) return false;

    // Beri jeda 300ms agar stack GATT Windows & ESP32 selesai melakukan service discovery
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 4. Ambil Service
    const service = await this.server.getPrimaryService(BLE_SERVICE_UUID);

    // 5. Ambil Karakteristik satu per satu
    this.profileChar = await service.getCharacteristic(BLE_PROFILE_CHAR_UUID);
    this.dataChar = await service.getCharacteristic(BLE_DATA_CHAR_UUID);

    if (this.onConnectionChangeCallback) {
      this.onConnectionChangeCallback(true);
    }

    console.log('[BLE] Berhasil terkoneksi dan GATT service siap digunakan!');
    return true;
  } catch (error: any) {
    console.error('Koneksi BLE gagal:', error);
    this.disconnect();
    throw error;
  }
}

  public disconnect(): void {
    if (this.device && this.device.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.server = null;
    this.profileChar = null;
    this.dataChar = null;
    if (this.onConnectionChangeCallback) {
      this.onConnectionChangeCallback(false);
    }
  }

  // KIRIM DATA PROFIL KE ESP32
  public async sendUserProfile(profileData: BleUserProfilePayload): Promise<void> {
    if (!this.profileChar) {
      throw new Error('Karakteristik profil belum siap atau perangkat belum terhubung.');
    }

    const payload = JSON.stringify({
      age: profileData.age,
      male: profileData.isMale ? 1 : 0,
      bmi: Number(profileData.bmi.toFixed(1)),
      smoker: profileData.isSmoker ? 1 : 0,
      diabet: (profileData as any).diabetes ? 1 : 0,
    });

    const encoder = new TextEncoder();
    await this.profileChar.writeValue(encoder.encode(payload));
    console.log('Data profil berhasil terkirim ke ESP32:', payload);
  }

  // BACA DATA HASIL UKUR DARI ESP32
  public async startListeningMeasurements(
    onDataReceived: (data: BleMeasurementPayload) => void
  ): Promise<void> {
    if (!this.dataChar) {
      throw new Error('Karakteristik sensor belum siap.');
    }

    await this.dataChar.startNotifications();
    this.dataChar.addEventListener('characteristicvaluechanged', (event: any) => {
      const value = event.target.value;
      const decoder = new TextDecoder('utf-8');
      const jsonString = decoder.decode(value);

      try {
        const parsed = JSON.parse(jsonString);
        onDataReceived({
          sysBP: Number(parsed.sysBP ?? parsed.systolic ?? 120),
          diaBP: Number(parsed.diaBP ?? parsed.diastolic ?? 80),
          bpm: Number(parsed.bpm ?? parsed.heartRate ?? 72),
          probability: Number(parsed.probability ?? 0.0),
          riskLevel: parsed.riskLevel === 'HIGH' || parsed.probability > 0.5 ? 'HIGH' : 'NORMAL',
          status: parsed.status ?? (parsed.riskLevel === 'HIGH' ? 'Hipertensi' : 'Normal'),
        });
      } catch (err) {
        console.error('Data BLE tidak sesuai format JSON:', jsonString);
      }
    });
  }
}

export const bleService = new BluetoothService();