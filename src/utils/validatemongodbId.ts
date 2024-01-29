import mongoose from 'mongoose';

interface validationProps {
  isValid: boolean;
}

export const validateMongodbId = (id: string): validationProps => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error('Invalid Id ');
  return { isValid };
};
