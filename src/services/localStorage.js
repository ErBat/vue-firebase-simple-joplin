export const isBrowser = () => typeof window !== "undefined"

export const getItem = (name) =>
  isBrowser() && window.localStorage.getItem(name)
    ? JSON.parse(window.localStorage.getItem(name) || '')
    : {};

export const setItem = (name, value) =>
  window.localStorage.setItem(name, JSON.stringify(value))