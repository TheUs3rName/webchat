const validateEmail = (email) => {
  return email.endsWith("@gmail.com") ? true : false;
};

const validatePassw = (passw) => {
  return passw.length >= 8 ? true : false;
};

export { validateEmail, validatePassw };
