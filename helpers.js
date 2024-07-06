export const removeDuplicates = function (data) {
  return data.filter(
    (obj1, i, arr) => arr.findIndex((obj2) => obj2.code === obj1.code) === i
  );
};

export const calculationOfConverting = function (rate) {
  return document.querySelector(".result-input").value * rate;
};
