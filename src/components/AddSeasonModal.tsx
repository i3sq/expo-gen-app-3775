import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Anime {
  id: string;
  title: string;
}

interface AddSeasonModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (animeId: string, seasonNumber: string) => void;
  animeList: Anime[];
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AddSeasonModal: React.FC<AddSeasonModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  animeList,
}) => {
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>('');
  const [seasonNumber, setSeasonNumber] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isVisible) {
      setSelectedAnimeId('');
      setSeasonNumber('');
      setIsDropdownOpen(false);
    }
  }, [isVisible]);

  const handleSave = () => {
    if (selectedAnimeId && seasonNumber) {
      onSubmit(selectedAnimeId, seasonNumber);
      onClose();
    }
  };

  const selectedAnime = animeList.find((a) => a.id === selectedAnimeId);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
        setIsDropdownOpen(false);
      }}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>إضافة موسم جديد</Text>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <Text style={styles.label}>اختر الأنمي</Text>
                <TouchableOpacity
                  style={styles.dropdownTrigger}
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Text style={[styles.dropdownTriggerText, !selectedAnime && styles.placeholderText]}>
                    {selectedAnime ? selectedAnime.title : 'اختر أنمي من القائمة'}
                  </Text>
                  <Ionicons 
                    name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>

                {isDropdownOpen && (
                  <View style={styles.dropdownListContainer}>
                    <FlatList
                      data={animeList}
                      keyExtractor={(item) => item.id}
                      style={styles.dropdownList}
                      nestedScrollEnabled
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedAnimeId(item.id);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{item.title}</Text>
                          {selectedAnimeId === item.id && (
                            <Ionicons name="checkmark" size={18} color="#007AFF" />
                          )}
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}

                <Text style={styles.label}>رقم الموسم</Text>
                <TextInput
                  style={styles.input}
                  placeholder="مثال: 1"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  value={seasonNumber}
                  onChangeText={setSeasonNumber}
                  textAlign="right"
                />

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!selectedAnimeId || !seasonNumber) && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={!selectedAnimeId || !seasonNumber}
                >
                  <Text style={styles.submitButtonText}>حفظ الموسم</Text>
                </TouchableOpacity>
              </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'right',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  dropdownTrigger: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  dropdownTriggerText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginTop: -15,
    marginBottom: 20,
    maxHeight: 150,
    overflow: 'hidden',
    zIndex: 1000,
  },
  dropdownList: {
    width: '100%',
  },
  dropdownItem: {
    padding: 14,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#A2CFFE',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default AddSeasonModal;
