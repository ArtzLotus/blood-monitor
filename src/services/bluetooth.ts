// src/services/bluetooth.ts

// UUID Standar BLE ESP32 Blood Pressure Monitor
export const BLE_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
export const BLE_PROFILE_CHAR_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // Tulis: Data Profil User -> ESP32
export const BLE_DATA_CHAR_UUID = 'cba1d466-344c-4be3-ab3f-189f80dd7518';    // Baca/Notify: Hasil Sensor -> Web

export interface BleMeasurementPayload {
  sysBP: number;
  diaBP: number;
  bpm: number;
  riskLevel: 'NORMAL' | 'HIGH';
  status: string;
}

class BluetoothService {
  private device: any = null;
  private server: any = null;
  private profileChar: any = null;
  private dataChar: any = null;

  // Cek ketersediaan Web Bluetooth API di browser
  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  // Koneksi ke ESP32
  public async connect(onDisconnectCallback?: () => void): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('Browser ini tidak mendukung Web Bluetooth API. Gunakan Chrome di Android atau Desktop.');
    }

    try {
      // 1. Scan perangkat Bluetooth
      this.device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ namePrefix: 'ESP32' }, { namePrefix: 'BP' }],
        optionalServices: [BLE_SERVICE_UUID],
      });

      if (!this.device) return false;

      // Event listener saat koneksi terputus tiba-tiba
      this.device.addEventListener('gattserverdisconnected', () => {
        this.server = null;
        this.profileChar = null;
        this.dataChar = null;
        if (onDisconnectCallback) onDisconnectCallback();
      });

      // 2. Hubungkan ke GATT Server
      this.server = await this.device.gatt?.connect() || null;
      if (!this.server) return false;

      // 3. Dapatkan Service utama
      const service = await this.server.getPrimaryService(BLE_SERVICE_UUID);

      // 4. Dapatkan Karakteristik Profil & Data Sensor
      this.profileChar = await service.getCharacteristic(BLE_PROFILE_CHAR_UUID);
      this.dataChar = await service.getCharacteristic(BLE_DATA_CHAR_UUID);

      return true;
    } catch (error: any) {
      console.error('Koneksi BLE gagal:', error);
      throw error;
    }
  }

  // Putuskan Sambungan
  public disconnect(): void {
    if (this.device && this.device.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.server = null;
    this.profileChar = null;
    this.dataChar = null;
  }

  // Cek status koneksi aktif
  public isConnected(): boolean {
    return !!(this.device && this.device.gatt?.connected);
  }

  // Kirim data profil ke ESP32
  public async sendUserProfile(profileData: {
    age: number;
    isMale: boolean;
    bmi: number;
    isSmoker: boolean;
  }): Promise<void> {
    if (!this.profileChar) {
      throw new Error('Belum terhubung ke ESP32.');
    }

    const payload = JSON.stringify({
      age: profileData.age,
      male: profileData.isMale ? 1 : 0,
      bmi: Number(profileData.bmi.toFixed(1)),
      smoker: profileData.isSmoker ? 1 : 0,
    });

    const encoder = new TextEncoder();
    await this.profileChar.writeValue(encoder.encode(payload));
  }

  // Dengarkan data hasil pembacaan sensor dari ESP32
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
          riskLevel: parsed.riskLevel === 'HIGH' || parsed.probability > 0.5 ? 'HIGH' : 'NORMAL',
          status: parsed.status ?? (parsed.riskLevel === 'HIGH' ? 'Hipertensi' : 'Normal'),
        });
      } catch (err) {
        console.error('Format data BLE tidak valid:', jsonString);
      }
    });
  }
}

export const bleService = new BluetoothService();