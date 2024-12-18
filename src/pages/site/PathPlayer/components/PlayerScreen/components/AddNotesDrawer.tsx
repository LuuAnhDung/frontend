/* eslint-disable @typescript-eslint/no-misused-promises */

import { Button, Drawer, Input, notification } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AddNoteDrawerProps {
  visible: boolean;
  onClose: () => void;
  noteContent: string;
  setNoteContent: (noteContent: string) => void;
  onSubmitNote: () => Promise<void>;
  isLoading: boolean;
  formattedTime: string;
  currLessonId: string;
}

const AddNoteDrawer: React.FC<AddNoteDrawerProps> = ({
  visible,
  onClose,
  noteContent,
  setNoteContent,
  onSubmitNote,
  formattedTime,
  isLoading,
  currLessonId
}) => {
  const [error, setError] = useState('');

  const validateNoteContent = () => {
    if (!noteContent.trim()) {
      setError('Note content cannot be empty');
      return false;
    }
    setError('');
    return true;
  };

  const handleSaveNote = async () => {
    const isValid = validateNoteContent();
    if (isValid) {
      try {
        await onSubmitNote();
        //Khi gọi hàm sẽ có thông báo thành công
        // notification.success({
        //   message: 'Successful',
        //   description: 'The note has been saved successfully'
        // });
        // onClose(); // Đóng drawer sau khi lưu thành công
      
        //const result = await onSubmitNote();
        
        // notification.success({
        //   message: 'Successful',
        //   description: 'The note has been saved successfully.',
        // });
        onClose();

      } catch (error) {
        notification.error({
          message: 'An error has occurred',
          description: 'Note archiving failed'
        });
      }
    }
  };

  const {t, i18n} = useTranslation('note');

  return (
    <Drawer title={t('note.add')} placement='right' closable={true} onClose={onClose} visible={visible}>
      <p className='mb-6 text-2xl'>
        {t('note.addnote')} <span className='bg-blue-950 p-2 text-white rounded-xl'>{formattedTime}</span>
      {/* Add notes at: */}
      </p>
      <Input.TextArea
        rows={4}
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder = {t('note.content')}  //'Note content...'
      />
      {error && <p className='text-red-600 mt-4'>{error}</p>}
      <Button type='primary' onClick={handleSaveNote} disabled={isLoading} style={{ marginTop: 16 }}>
        {isLoading ? 'Saving...' : t('note.save')}
      </Button>
    </Drawer>
  );
};

export default AddNoteDrawer;
