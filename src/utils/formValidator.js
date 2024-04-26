const validateEmail = (email) => {
  return email.endsWith("@gmail.com") ? true : false;
};

const validatePassw = (passw) => {
  return passw.length >= 8 ? true : false;
};

const validateName = (name) => {
  return name.length >= 5 ? true : false;
};

export { validateEmail, validatePassw, validateName };
