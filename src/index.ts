import "./styles/main.scss";

const table = document.querySelector(".table") as HTMLElement;
const code = document.querySelector(".code") as HTMLElement;
const enterButton = document.querySelector(".editor__button") as HTMLElement;
const input = document.querySelector(".editor__input") as HTMLInputElement;
const awaiting = "bento > orange.small";
let currentElem: null | HTMLElement = null;
const tableItemsMarkup = `<bento class="" style="width: 100px;" data-table="bento-0">
  <orange class="" style="width: 60px;" data-table="orange-1"></orange>
</bento>
<orange class="small" style="width: 30px;" data-table="orange-2"></orange>
<bento class="" style="width: 100px;" data-table="bento-3">
  <orange class="small strobe" style="width: 30px;" data-table="orange-4" data-target="true"></orange>
</bento>
<bento class="" style="width: 100px;" data-table="bento-5">
  <apple class="small" style="width: 30px;" data-table="apple-6"></apple>
</bento>
<bento class="" style="width: 100px;" data-table="bento-7">
  <orange class="small strobe" style="width: 30px;" data-table="orange-8" data-target="true"></orange>
</bento>`;
const markup =
  "<div class='markup'><div>&lt;div class='table'&gt;<div class='' data-code='bento-0'>&lt;bento&gt;<div class='' data-code='orange-1'>&lt;orange /&gt;</div>&lt;/bento&gt;</div><div class='' data-code='orange-2'>&lt;orange  class='small' /&gt;</div><div class='' data-code='bento-3'>&lt;bento&gt;<div class='' data-code='orange-4'>&lt;orange  class='small' /&gt;</div>&lt;/bento&gt;</div><div data-code='bento-5'>&lt;bento&gt;<div data-code='apple-6'>&lt;apple  class='small' /&gt;</div>&lt;/bento&gt;</div><div class='' data-code='bento-7'>&lt;bento&gt;<div class='' data-code='orange-8'>&lt;orange  class='small' /&gt;</div>&lt;/bento&gt;</div>&lt;/div&gt;</div></div>";
code.innerText = "<table></table>";
table.innerHTML = tableItemsMarkup;

code.innerHTML = markup;
const markupElement = document.querySelector(".markup") as HTMLElement;

const findInViewer = (element: HTMLElement) => {
  let codeElem;
  if (element.dataset.table) {
    codeElem = document.querySelector(`[data-code=${element.dataset.table}]`);
    codeElem?.classList.toggle("highlight-code");
  }
  return codeElem as HTMLElement;
};

const findOnTable = (element: HTMLElement) => {
  let tableElem;
  if (element.dataset.code) {
    tableElem = document.querySelector(`[data-table=${element.dataset.code}]`);
    tableElem?.classList.toggle("highlight");
  }
  return tableElem as HTMLElement;
};

const viewTargetElement = (element: HTMLElement) => {
  const div = document.createElement("div");
  div.classList.add("view-target");
  if (element.dataset.code) {
    const codeEl = document.querySelector(
      `[data-code=${element.dataset.code}]`
    ) as HTMLElement;
    div.innerText = codeEl.innerText;
  } else if (element.dataset.table) {
    const codeEl = document.querySelector(
      `[data-code=${element.dataset.table}]`
    ) as HTMLElement;
    div.innerText = codeEl.innerText;
  } else {
    div.innerText = element.childNodes[0].textContent as string;
  }

  table.append(div);
};

const removeTargetElement = () => {
  table.removeChild(table.lastChild as HTMLElement);
};
const onElement = (event: MouseEvent) => {
  if (currentElem) return;
  const target = event.target as HTMLElement;
  const relatedTarget = event.relatedTarget as HTMLElement;
  if (target.classList.contains("table")) return;
  currentElem = target;
  if (table.contains(target)) {
    target.classList.add("highlight");
    viewTargetElement(target);

    findInViewer(target);
  } else if (markupElement.contains(target)) {
    target.classList.add("highlight-code");
    viewTargetElement(target);

    findOnTable(target);
  }

  if (relatedTarget) relatedTarget.classList.remove("highlight");
};

const leaveElement = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!currentElem) return;
  if (table.contains(target)) {
    target.classList.remove("highlight");
    findInViewer(target);
    removeTargetElement();
  } else if (markupElement.contains(target)) {
    target.classList.remove("highlight-code");
    findOnTable(target);
    removeTargetElement();
  }
  currentElem = null;
};
table.addEventListener("mouseover", onElement);
table.addEventListener("mouseout", leaveElement);
code.addEventListener("mouseover", onElement);
code.addEventListener("mouseout", leaveElement);

const winAnimation = () => {
  const div = document.createElement("div");
  div.innerText = "Right!";
  div.classList.add("answer", "win-animation");
  document.body.append(div);
};

const wrongAnimation = () => {
  const div = document.createElement("div");
  div.innerText = "Wrong!";
  div.classList.add("answer", "wrong-animation");
  document.body.append(div);
  setTimeout(() => {
    div.classList.remove("answer", "wrong-animation");
    div.remove();
  }, 3000);
};

const checkInput = () => {
  if (input.value === awaiting) {
    console.log("right");
    winAnimation();
    document.body.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  } else {
    console.log("wrong");
    wrongAnimation();
  }
};
input.addEventListener("keypress", (e) => {
  if (e.key !== "Enter") return;
  checkInput();
});
enterButton.addEventListener("click", checkInput);

window.addEventListener("load", () => {
  console.log("LOADED");
});
