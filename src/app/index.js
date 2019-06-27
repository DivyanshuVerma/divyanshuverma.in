function component() {
  const element = document.createElement('h1');
  element.innerHTML = 'powered by webpack';
  return element;
}

document.body.appendChild(component());
