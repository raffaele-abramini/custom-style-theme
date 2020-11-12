import { memoizer } from "./baseMemoizer";

const sortBySpecificity = (a, b) => a.specificity - b.specificity;

const formatCustomRules = (customObj) => {
  const customRules = [];

  Object.keys(customObj).forEach((key) => {
    const groups = key.split(",").map((g) => g.trim());

    groups.forEach((group) => {
      const conditions = group
        .split(".")
        .filter(Boolean)
        .map((condition) => {
          console.log("looping through");

          const [, propName, propVal] =
            condition.match(/([a-zA-Z]+)_([a-zA-Z]+)/) || [];

          if (!propName) {
            console.error(propName, "is not a valid format rule");
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
    if (key.match(/^\.([a-zA-Z]+)_(.+)/g)) {
      propVariants[key] = customObj[key];
    } else {
      cssRules[key] = customObj[key];
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
