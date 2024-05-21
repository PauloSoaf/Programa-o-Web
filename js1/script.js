for (let i = 1; i <= 10; i++) {
  document.write(`<table border='1'>`);
  document.write(`<th colspan=2>Produros de ${i}</th>`);
  for (let j = 1; j <= 10; j++) {
    document.write(`<tr>`);
    document.write(`<td>${i + "x" + j}</td>`);
    document.write(`<td>${i * j}</td>`);
    document.write(`</tr>`);
  }
  document.write(`</table>`);
}
