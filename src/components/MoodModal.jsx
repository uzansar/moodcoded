import { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { formatDisplayDate, formatDate } from '../utils/dateUtils';
import { getMoodColor, getMoodLabel } from '../utils/moodUtils';

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Dialog = styled.div`
  width: 100%;
  max-width: 560px;
  background-color: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 14px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.15s ease-out;

  @keyframes slideUp {
    from { transform: translateY(12px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const HeaderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const DateDisplay = styled.span`
  font-size: 0.82rem;
  color: ${props => props.theme.textSecondary};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${props => props.theme.surfaceHover};
    color: ${props => props.theme.text};
  }
`;

const DialogBody = styled.div`
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-height: calc(85vh - 120px);
  overflow-y: auto;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 10px;
`;

const RatingSelectionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CurrentMoodBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-left: 4px solid ${props => props.$color};
`;

const BannerLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const BigRatingNumber = styled.span`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${props => props.$color};
  line-height: 1;
`;

const RatingMax = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
`;

const MoodStatusBadge = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const StepperGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
`;

const StepButton = styled.button`
  aspect-ratio: 1;
  border-radius: 8px;
  border: 1px solid ${props => props.$isSelected ? props.$color : props.theme.border};
  background-color: ${props => props.$isSelected ? props.$color : props.theme.surface};
  color: ${props => props.$isSelected ? '#FFFFFF' : props.theme.text};
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    border-color: ${props => props.$color};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const SentimentChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const SentimentChip = styled.button`
  background-color: ${props => props.$active ? props.theme.accentLight : props.theme.chipBg};
  border: 1px solid ${props => props.$active ? props.theme.accent : 'transparent'};
  color: ${props => props.$active ? props.theme.accent : props.theme.textSecondary};
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${props => props.theme.text};
    background-color: ${props => props.theme.chipHover};
  }
`;

const JournalTextarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  background-color: ${props => props.theme.inputBg};
  border: 1px solid ${props => props.theme.inputBorder};
  border-radius: 8px;
  color: ${props => props.theme.text};
  padding: 14px;
  font-size: 0.92rem;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    border-color: ${props => props.theme.accent};
    box-shadow: 0 0 0 3px ${props => props.theme.accentLight};
  }

  &::placeholder {
    color: ${props => props.theme.textDisabled};
  }
`;

const DialogFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  border-top: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.surface};
`;

const Button = styled.button`
  height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${props => props.theme.accent};
  color: #FFFFFF;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.accentHover};
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.surfaceHover};
  }
`;

const DeleteButton = styled(Button)`
  background-color: transparent;
  color: #EF4444;

  &:hover:not(:disabled) {
    background-color: rgba(239, 68, 68, 0.08);
  }
`;

const ErrorNotice = styled.div`
  padding: 10px 14px;
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  border-left: 3px solid #EF4444;
  border-radius: 6px;
  font-size: 0.85rem;
`;

const QUICK_TAGS = [
  'Grateful',
  'Relaxed',
  'Productive',
  'Energetic',
  'Calm',
  'Anxious',
  'Tired',
  'Stressed',
  'Reflective'
];

const ModalContent = ({ date, initialMood, onClose, onSave, onDelete, theme, isDark }) => {
  const [rating, setRating] = useState(initialMood?.rating || 5);
  const [entry, setEntry] = useState(initialMood?.entry || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const todayStr = formatDate(new Date());
  const isFuture = date > todayStr;
  const moodColor = getMoodColor(rating, isDark);
  const moodLabel = getMoodLabel(rating);

  const handleQuickTagClick = (tag) => {
    setEntry(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return `#${tag} `;
      if (trimmed.includes(`#${tag}`)) return prev;
      return `${trimmed} #${tag} `;
    });
  };

  const handleSave = async () => {
    if (isFuture) {
      setError('Cannot log mood for future dates.');
      return;
    }
    setSaving(true);
    setError('');
    const result = await onSave(date, Number(rating), entry);
    setSaving(false);
    if (result?.success) {
      onClose();
    } else {
      setError(result?.error || 'Failed to save reflection.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete mood entry for this day?')) return;
    setSaving(true);
    setError('');
    const result = await onDelete(date);
    setSaving(false);
    if (result?.success) {
      onClose();
    } else {
      setError(result?.error || 'Failed to delete mood entry.');
    }
  };

  return (
    <Dialog onClick={(e) => e.stopPropagation()} theme={theme}>
      <DialogHeader theme={theme}>
        <HeaderGroup>
          <Title theme={theme}>Daily Reflection</Title>
          <DateDisplay theme={theme}>{formatDisplayDate(date)}</DateDisplay>
        </HeaderGroup>
        <CloseButton onClick={onClose} aria-label="Close dialog" theme={theme}>
          ✕
        </CloseButton>
      </DialogHeader>

      <DialogBody>
        {error && <ErrorNotice>{error}</ErrorNotice>}

        <RatingSelectionSection>
          <FieldLabel theme={theme}>How was your day overall?</FieldLabel>

          <CurrentMoodBanner $color={moodColor} theme={theme}>
            <BannerLeft>
              <BigRatingNumber $color={moodColor}>{rating}</BigRatingNumber>
              <RatingMax theme={theme}>/ 10</RatingMax>
            </BannerLeft>
            <MoodStatusBadge theme={theme}>{moodLabel}</MoodStatusBadge>
          </CurrentMoodBanner>

          <StepperGrid>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => {
              const valColor = getMoodColor(val, isDark);
              const isSelected = rating === val;
              return (
                <StepButton
                  key={val}
                  type="button"
                  $isSelected={isSelected}
                  $color={valColor}
                  onClick={() => setRating(val)}
                  disabled={isFuture || saving}
                  theme={theme}
                >
                  {val}
                </StepButton>
              );
            })}
          </StepperGrid>
        </RatingSelectionSection>

        <div>
          <FieldLabel theme={theme}>Journal & Moments</FieldLabel>
          <JournalTextarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Write freely about your feelings, highlights, or struggles..."
            disabled={isFuture || saving}
            theme={theme}
          />

          <SentimentChipsRow>
            {QUICK_TAGS.map(tag => (
              <SentimentChip
                key={tag}
                type="button"
                $active={entry.includes(`#${tag}`)}
                onClick={() => handleQuickTagClick(tag)}
                theme={theme}
              >
                #{tag}
              </SentimentChip>
            ))}
          </SentimentChipsRow>
        </div>
      </DialogBody>

      <DialogFooter theme={theme}>
        {initialMood && (
          <DeleteButton onClick={handleDelete} disabled={saving} theme={theme}>
            Delete Entry
          </DeleteButton>
        )}
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <SecondaryButton onClick={onClose} disabled={saving} theme={theme}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={handleSave} disabled={isFuture || saving} theme={theme}>
            {saving ? 'Saving...' : 'Save Reflection'}
          </PrimaryButton>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

const MoodModal = ({ date, initialMood, isOpen, onClose, onSave, onDelete }) => {
  const { theme, isDark } = useTheme();

  if (!isOpen || !date) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent
        key={date}
        date={date}
        initialMood={initialMood}
        onClose={onClose}
        onSave={onSave}
        onDelete={onDelete}
        theme={theme}
        isDark={isDark}
      />
    </ModalBackdrop>
  );
};

export default MoodModal;
