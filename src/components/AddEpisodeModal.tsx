import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Anime {
  id: string;
  title: string;
  seasons: Season[];
}

interface Season {
  id: string;
  number: number;
}

interface AddEpisodeModalProps {
  isVisible: boolean;
  onClose: () => void;
  animeList: Anime[];
  onAdd: (animeId: string, seasonId: string, episodeTitle: string, videoUrl: string) => void;
}

const AddEpisodeModal: React.FC<AddEpisodeModalProps> = ({
  isVisible,
  onClose,
  animeList,
  onAdd,
}) => {
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>('');
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');
  const [episodeTitle, setEpisodeTitle] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');

  const availableSeasons = useMemo(() => {
    const anime = animeList.find((a) => a.id === selectedAnimeId);
    return anime ? anime.seasons : [];
  }, [selectedAnimeId, animeList]);

  const handleAdd = () => {
    if (!selectedAnimeId || !selectedSeasonId || !episodeTitle.trim() || !videoUrl.trim()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    onAdd(selectedAnimeId, selectedSeasonId, episodeTitle, videoUrl);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedAnimeId('');
    setSelectedSeasonId('');
    setEpisodeTitle('');
    setVideoUrl('');
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={styles.title}>إضافة حلقة جديدة</Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.form}>
                <Text style={styles.label}>اختر الأنمي</Text>
                <View style={styles.pickerContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChips}>
                    {animeList.map((anime) => (
                      <TouchableOpacity
                        key={anime.id}
                        style={[
                          styles.chip,
                          selectedAnimeId === anime.id && styles.activeChip,
                        ]}
                        onPress={() => {
                          setSelectedAnimeId(anime.id);
                          setSelectedSeasonId('');
                        }}
                      >
                        <Text style={[styles.chipText, selectedAnimeId === anime.id && styles.activeChipText]}>
                          {anime.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {selectedAnimeId !== '' && (
                  <>
                    <Text style={styles.label}>اختر الموسم</Text>
                    <View style={styles.pickerContainer}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChips}>
                        {availableSeasons.map((season) => (
                          <TouchableOpacity
                            key={season.id}
                            style={[
                              styles.chip,
                              selectedSeasonId === season.id && styles.activeChip,
                            ]}
                            onPress={() => setSelectedSeasonId(season.id)}
                          >
                            <Text style={[styles.chipText, selectedSeasonId === season.id && styles.activeChipText]}>
                              الموسم {season.number}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </>
                )}

                <Text style={styles.label}>عنوان الحلقة أو رقمها</Text>
                <TextInput
                  style={styles.input}
                  placeholder="مثال: الحلقة 01"
                  placeholderTextColor="#999"
                  value={episodeTitle}
                  onChangeText={setEpisodeTitle}
                  textAlign="right"
                />

                <Text style={styles.label}>رابط الفيديو (URL)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://example.com/video.mp4"
                  placeholderTextColor="#999"
                  value={videoUrl}
                  onChangeText={setVideoUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  textAlign="left"
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
                  <Text style={styles.submitButtonText}>إضافة الحلقة</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    color: '#000',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  horizontalChips: {
    flexDirection: 'row-reverse',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  activeChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  activeChipText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddEpisodeModal;