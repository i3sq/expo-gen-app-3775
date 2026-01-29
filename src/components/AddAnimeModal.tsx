import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';

interface AddAnimeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (animeData: { name: string; description: string; imageUrl: string }) => void;
}

const AddAnimeModal: React.FC<AddAnimeModalProps> = ({ isVisible, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleClose = () => {
    setName('');
    setDescription('');
    setImageUrl('');
    onClose();
  };

  const handleSubmit = () => {
    if (!name.trim() || !description.trim() || !imageUrl.trim()) {
      Alert.alert('تنبيه', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
    });

    handleClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <TouchableOpacity onPress={handleClose}>
                  <Text style={styles.cancelButton}>إلغاء</Text>
                </TouchableOpacity>
                <Text style={styles.title}>إضافة أنمي جديد</Text>
                <TouchableOpacity onPress={handleSubmit}>
                  <Text style={styles.doneButton}>إضافة</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>اسم الأنمي</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="أدخل اسم الأنمي هنا..."
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>رابط صورة الغلاف</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="https://example.com/image.jpg"
                    placeholderTextColor="#999"
                    value={imageUrl}
                    onChangeText={setImageUrl}
                    autoCapitalize="none"
                    keyboardType="url"
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>الوصف (بالعربية)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="اكتب وصفاً مختصراً للأنمي..."
                    placeholderTextColor="#999"
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                    numberOfLines={4}
                    textAlign="right"
                  />
                </View>

                <View style={styles.previewContainer}>
                  {imageUrl ? (
                    <Text style={styles.previewText}>سيتم التحقق من الرابط عند الحفظ</Text>
                  ) : null}
                </View>
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
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  cancelButton: {
    fontSize: 17,
    color: '#FF3B30',
  },
  doneButton: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    marginRight: 4,
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C6C6C8',
    writingDirection: 'rtl',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  previewText: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
});

export default AddAnimeModal;