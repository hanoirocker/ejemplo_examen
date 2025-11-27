export interface Feedback {
  email: string;
  type: 'bug' | 'suggestion';
  message: string;
}

export const saveFeedback = async (feedback: Feedback): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('--> DB: registro guardado correctamente!');
      resolve(true);
    }, 1500);
  });
};
