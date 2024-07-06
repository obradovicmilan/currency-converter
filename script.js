import { removeDuplicates, calculationOfConverting } from "./helpers.js";
import { eventListeners } from "./eventListeners.js";

const inputs = document.querySelectorAll(".input");
const dropdown = document.querySelectorAll(".dropdown-container");

const loadCountries = async function () {
  try {
    const resCountries = await fetch("https://restcountries.com/v3.1/all");

    if (!resCountries.ok) throw new Error("Problem getting countrie data");

    const countriesObj = await resCountries.json();

    const nameArr = Object.entries(countriesObj).map((el) => {
      const [data] = el[1].currencies ? Object.keys(el[1].currencies) : "";
      const [name] = el[1].currencies ? Object.values(el[1].currencies) : "";

      return [name?.name, el[1].flags.svg, data];
    });

    return nameArr;
  } catch (err) {
    console.error(`${err.message} `);
  }
};

export const convertingAJAXCallToObject = async function () {
  const countriesData = await loadCountries();

  const countriesDataArr = countriesData.map((el) => {
    return {
      name: el[0],
      code: el[2],
      flag: el[1],
    };
  });

  const filteredCountriesData = removeDuplicates(countriesDataArr);

  filteredCountriesData.sort((a, b) => {
    if (a.name > b.name) return -1;

    if (a.name < b.name) return 1;

    return 0;
  });

  //Removing undefined results
  const indexOfUndefined = filteredCountriesData.findIndex((el) => !el.code);
  filteredCountriesData.splice(indexOfUndefined, 1);

  return filteredCountriesData;
};

export const renderCountries = async function (obj, element) {
  Object.values(obj).forEach((el, i, arr) => {
    const html = `
      <a class="option">
       <img class="flag-img" src="${el.flag}">
       <span class="currency-code">${el.code}
       </span>
       <span class="currency--name">${el.name}</span>
     </a>`;

    element.forEach((el) => el.insertAdjacentHTML("afterbegin", html));
  });
};

export const currencyAJAXCall = async function (codeCurrency) {
  try {
    const resCurrency = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${codeCurrency}.json`
    );

    if (!resCurrency.ok) throw new Error("Problem getting countrie data");

    const dataCurrency = await resCurrency.json();
    return dataCurrency;
  } catch (err) {
    console.error(`${err.message}`);
  }
};

export const converstionCurrency = async function () {
  const flagContainer1 =
    document.querySelectorAll(".main-container")[0].firstElementChild;
  const flagContainer2 =
    document.querySelectorAll(".main-container")[1].firstElementChild;

  const currencyCode1 = flagContainer1.lastElementChild.innerHTML
    .slice(0, 3)
    .toLocaleLowerCase();

  const currencyCode2 = flagContainer2.lastElementChild.innerHTML
    .slice(0, 3)
    .toLocaleLowerCase();

  const rate = await currencyAJAXCall(currencyCode1);

  if (document.querySelector(".result-input").value == "")
    return (document.querySelector(".result").innerText =
      "Enter postive number");

  document.querySelector(".result").innerText = calculationOfConverting(
    rate[currencyCode1][currencyCode2]
  );
};

renderCountries(await convertingAJAXCallToObject(), dropdown);

eventListeners();
