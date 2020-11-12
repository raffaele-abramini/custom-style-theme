import { memoizer } from "./baseMemoizer";

const queryCheck = (s) => document.createDocumentFragment().querySelector(s);

const isSelectorValid = (selector) => {
  try {
    queryCheck(selector);
  } catch {
    return false;
  }
  return true;
};

const camelCaseToKebabCase = (string) =>
  string.replace(/(?<=[a-z])[A-Z]/g, (a) => `-${a.toLocaleLowerCase()}`);

const sortBySpecificity = (a, b) => a.specificity - b.specificity;

const formatCustomRules = (customObj) => {
  const customRules = [];

  Object.keys(customObj).forEach((key) => {
    const groups = key.split(",").map((g) => g.trim());

    groups.forEach((group) => {
      const conditions = group.split(".").map((condition) => {
        console.log("looping through");

        const [, propName, propVal] = condition.match(/(.+)_(.+)/) || [];

        if (!propName) {
          console.error(condition, "is not a valid format rule");
        }

        return { propName, propVal };
      });

      customRules.push({
        conditions,
        specificity: conditions.length,
        styles: customObj[key]
      });
    });
  });

  return customRules;
};

const getRules = (customObj) => {
  const cssRules = {},
    propVariants = {};

  Object.keys(customObj).forEach((key) => {
    if (CSS.supports(camelCaseToKebabCase(key), customObj[key])) {
      cssRules[key] = customObj[key];
    } else {
      propVariants[key] = customObj[key];
    }
  });
  console.log(cssRules);

  const formattedCustomRules = formatCustomRules(propVariants);

  return [cssRules, formattedCustomRules];
};

const memoizedRules = memoizer(getRules);

export const applyFromTheme = (customObj, p) => {
  const [cssRules, formattedCustomRules] = memoizedRules(customObj);

  return formattedCustomRules.sort(sortBySpecificity).reduce(
    (acc, { conditions, styles }) => {
      if (
        conditions.every(({ propName, propVal }) => {
          return p[propName] && p[propName].toString() === propVal.toString();
        })
      ) {
        acc = {
          ...acc,
          ...styles
        };
      }
      return acc;
    },
    { ...cssRules }
  );
};
