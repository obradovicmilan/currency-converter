import {
  convertingAJAXCallToObject,
  renderCountries,
  converstionCurrency,
} from "./script.js";
import { removeDuplicates } from "./helpers.js";

const mainContainer = document.querySelectorAll(".main-container");
const closeBtns = document.querySelectorAll(".close-btn");
const moreBtns = document.querySelectorAll(".more-btn");
const inputs = document.querySelectorAll(".input");
const dropdown = document.querySelectorAll(".dropdown-container");
const convertBtn = document.querySelector(".convert-button");

let currentValues = {};

let startingValues = {
  first: {
    name: inputs[0].value,
  },
  second: {
    name: inputs[1].value,
  },
};

//Event Listeners
export const eventListeners = async function () {
  mainContainer.forEach((el) => {
    el.addEventListener("mouseover", function () {
      el.querySelector(".close-btn").classList.remove("hidden");
    });

    el.addEventListener("mouseout", function () {
      const input = Array.from(el.children).find((el) =>
        el.classList.contains("input")
      );

      if (input === document.activeElement) return;

      el.querySelector(".close-btn").classList.add("hidden");
    });
  });

  moreBtns.forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const target = e.target.closest(".main-container");
      const activeDropdown = Array.from(dropdown).find((el) =>
        el.classList.contains("dropdown--active")
      );

      //1) Close already active dropdown menu
      if (
        Array.from(dropdown).some((el) =>
          el.classList.contains("dropdown--active")
        )
      )
        activeDropdown?.classList.remove("dropdown--active");

      //2) Open targeted dropdown menu
      target.nextElementSibling.classList.add("dropdown--active");
    });
  });

  window.addEventListener("click", function (e) {
    const activeDropdown = Array.from(dropdown).find((el) =>
      el.classList.contains("dropdown--active")
    );

    //1)Guard clause
    if (activeDropdown?.previousElementSibling.contains(e.target)) return;

    //2)Closing active dropdown menu
    activeDropdown?.classList.remove("dropdown--active");
  });

  dropdown.forEach((el) => {
    //1)Hover effect
    el.addEventListener("mouseover", function (e) {
      if (e.target.closest(".option"))
        e.target.closest(".option").classList.add("option--hover");
    });

    el.addEventListener("mouseout", function (e) {
      if (e.target.closest(".option"))
        e.target.closest(".option").classList.remove("option--hover");
    });

    //Click listener on dropdown option
    el.addEventListener("click", function (e) {
      //finding active dropdown menu
      const activeDropdown = Array.from(dropdown).find((el) =>
        el.classList.contains("dropdown--active")
      );

      //Getting values from clicked options, img, currency code and name of currency
      const optionChilds = Array.from(e.target.closest(".option").children).map(
        (el) => el.cloneNode(true)
      );

      const img = optionChilds[0];
      const code = optionChilds[1];
      const name = optionChilds[2].innerText;

      const flagContainer =
        activeDropdown?.previousElementSibling.querySelector(".flag-container");

      flagContainer.innerHTML = "";
      flagContainer.insertAdjacentElement("afterbegin", img);
      flagContainer.insertAdjacentElement("beforeend", code);
      //Input value = currency name
      flagContainer.nextElementSibling.value = name;

      return (currentValues = {
        img: img.src,
        currencyCode: code.innerText,
        name: name,
      });
    });
  });

  let countryName;

  //////////////////////
  //INPUTS
  inputs.forEach((el) => {
    el.setAttribute("autocomplete", "off");
    const flagContainer = el.previousElementSibling;

    el.addEventListener("focus", function (e) {
      const img = flagContainer.querySelector("img").src;
      const currencyCode = flagContainer.querySelector("span")?.innerText;

      currentValues = {
        img: img,
        currencyCode: currencyCode,
        name: el.value,
      };

      flagContainer.innerHTML = `<img class="flag-img" src="imgs/magnifying-glass.svg" />`;

      //Setting active dropdown class when input have focus
      el.parentElement.nextElementSibling.classList.add("dropdown--active");
    });

    el.addEventListener("focusout", function (e) {
      const inputOrdinalNumber = el.dataset.ordinal;

      flagContainer.innerHTML = `<img class="flag-img" src="${currentValues.img}" />
            <span class="currency-code">${currentValues.currencyCode} </span>`;

      if (el.value === "") {
        el.value = countryName || startingValues[inputOrdinalNumber].name;
      }
    });

    //Searchbar
    el.addEventListener("keyup", async function (e) {
      const filtered = Array.from(await convertingAJAXCallToObject()).filter(
        (item) => {
          return item.name
            .toLocaleLowerCase()
            .includes(e.target.value.toLocaleLowerCase());
        }
      );

      //Guard clause to dont show 2 same options
      if (
        filtered[0].name ===
        el.parentElement.nextElementSibling.firstElementChild.lastElementChild
          .innerText
      )
        return;

      renderCountries(removeDuplicates(filtered), dropdown);
    });
  });

  closeBtns.forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();

      const input = el.parentElement.previousElementSibling;
      countryName = input.value;

      input.value = "";
      input.focus();
    });
  });

  convertBtn.addEventListener("click", function (e) {
    e.preventDefault();
    converstionCurrency();
  });

  //Submit with enter
  document
    .querySelector(".result-input")
    .addEventListener("keydown", function (e) {
      if (e.key === "Enter") converstionCurrency();
    });

  document
    .querySelector(".swap-button")
    .addEventListener("click", function (e) {
      e.preventDefault();

      let flagContainer1 = mainContainer[0].firstElementChild;
      let flagContainer2 = mainContainer[1].firstElementChild;

      let currencyName1 = mainContainer[0].children[1];
      let currencyName2 = mainContainer[1].children[1];

      const flagContainerCopy = flagContainer1.innerHTML;
      const currencyNameCopy = currencyName1.value;

      flagContainer1.innerHTML = flagContainer2.innerHTML;
      flagContainer2.innerHTML = flagContainerCopy;

      currencyName1.value = currencyName2.value;
      currencyName2.value = currencyNameCopy;

      document.querySelector(".result").innerText = "";
    });
};
