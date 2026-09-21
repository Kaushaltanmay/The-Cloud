import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

export const ImageProcessorService = {
  /**
   * Request gallery / media library permission
   */
  async requestPermissions(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  },

  /**
   * Pick an image from camera roll with 1:1 square face crop
   */
  async pickAndCropFace(friendNumber: 1 | 2): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        alert('Permission required to access your photos to select face images!');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1], // Square crop for face
        quality: 0.85,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const tempUri = result.assets[0].uri;

      // Copy to persistent documentDirectory so it doesn't get wiped by OS cache cleaner
      const permanentFilename = `face_friend_${friendNumber}_${Date.now()}.jpg`;
      const docDir = FileSystem.documentDirectory;
      
      if (docDir) {
        const permanentUri = `${docDir}${permanentFilename}`;
        await FileSystem.copyAsync({
          from: tempUri,
          to: permanentUri,
        });
        return permanentUri;
      }

      return tempUri;
    } catch (e) {
      console.warn('Error picking image', e);
      return null;
    }
  },

  /**
   * Directly snap a photo with camera and crop
   */
  async captureFace(friendNumber: 1 | 2): Promise<string | null> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required to snap a photo!');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const tempUri = result.assets[0].uri;
      const permanentFilename = `face_friend_${friendNumber}_${Date.now()}.jpg`;
      const docDir = FileSystem.documentDirectory;
      
      if (docDir) {
        const permanentUri = `${docDir}${permanentFilename}`;
        await FileSystem.copyAsync({
          from: tempUri,
          to: permanentUri,
        });
        return permanentUri;
      }

      return tempUri;
    } catch (e) {
      console.warn('Error taking camera photo', e);
      return null;
    }
  },
};
