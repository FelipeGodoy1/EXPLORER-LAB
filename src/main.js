import "./css/index.css"
import IMask from "imask"


const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")
const nomeTitular = document.querySelector("#card-holder")
const modal = document.querySelector(".modal");
const regex = {
  nome: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/,
  numeroCartao: /^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/,
  dataExp: /^[0-9]{2}\/[0-9]{2}$/,
  secCode: /(^[0-9]{3}|^[0-9]{4})$/
}

function setCardType(type) {
  
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    hipercard: ["#FBCEB1", "#841617"],
    elo: ["#232526", "#414345"],
    default: ["black", "gray"]
  }

  //Alterando as cores do cartao de credito
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])

  //Aterando o icone do cartao de credito
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

setCardType("default")




/*
 * Aula 2
 */

//security code mask
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)




//expiration date mask
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks:{

      MM: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12
      },

      YY: {
        mask: IMask.MaskedRange,
        from: String(new Date().getFullYear()).slice(2),
        to: String(new Date().getFullYear() + 10).slice(2)
      }
    }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)




//number card mask
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
      
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(606282\d{10}(\d{3})?)|(3841\d{15})$/,
      cardtype: "hipercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^504175|^627780|^63(6297|6368|6369)|(65003[5-9]|65004[0-9]|65005[01])|(65040[5-9]|6504[1-3][0-9])|(65048[5-9]|65049[0-9]|6505[0-2][0-9]|65053[0-8])|(65054[1-9]|6505[5-8][0-9]|65059[0-8])|(65070[0-9]|65071[0-8])|(65072[0-7])|(65090[1-9]|6509[1-6][0-9]|65097[0-8])|(65165[2-9]|6516[67][0-9])|(65500[0-9]|65501[0-9])|(65502[1-9]|6550[34][0-9]|65505[0-8])|^(506699|5067[0-6][0-9]|50677[0-8])|^(509[0-8][0-9]{2}|5099[0-8][0-9]|50999[0-9])|^65003[1-3]|^(65003[5-9]|65004\d|65005[0-1])|^(65040[5-9]|6504[1-3]\d)|^(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|^(65054[1-9]|6505[5-8]\d|65059[0-8])|^(65070\d|65071[0-8])|^65072[0-7]|^(65090[1-9]|65091\d|650920)|^(65165[2-9]|6516[6-7]\d)|^(65500\d|65501\d)|^(65502[1-9]|6550[3-4]\d|65505[0-8])/,
      cardtype: "elo"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function (appended, dynamicMasked) {

    const number = (dynamicMasked.value + appended).replace(/\D/g,'')
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask

  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)



/*
 * Aula 3
*/



document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
})





//Exibindo nome do titular no cartao
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {

  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText = cardHolder.value

  if (cardHolder.value == "") {
    ccHolder.innerText = "FULANO DA SILVA"
  }

})



//Exibindo codigo de segurança no cartão
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code;

  if(code.length === 0) {
    ccSecurity.innerText = "123"
  }
}



//Exibindo numero do cartao
cardNumberMasked.on("accept", () => {

  //pegando a bandeira do cartao
  const cardType = cardNumberMasked.masked.currentMask.cardtype

  setCardType(cardType)

  updateNumberCard(cardNumberMasked.value)

})

function updateNumberCard(num) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = num


  if (num.length === 0) {
    ccNumber.innerText ="1234 5678 9012 3456"
  }
}



//Exibindo data de experaçao do cartao
expirationDateMasked.on("accept", () => {
  updateDataCard(expirationDateMasked.value)
})

function updateDataCard(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value")

  ccExpiration.innerText = date

  if ( date.length === 0) {
    ccExpiration.innerText = "02/32"
  }
}


/*
 * Extra
*/

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  
  let nome = nomeTitular.value.length;

  if(regex.numeroCartao.test(cardNumberMasked.value) &&
    regex.dataExp.test(expirationDateMasked.value) &&
    regex.nome.test(nomeTitular.value) && nome >= 5 &&
    regex.secCode.test(securityCodeMasked.value)) {

      testName();
      testNumberCard();
      testData();
      testSecurity();

      modal.style.display="flex"
      
      this.disable="true"

  }else {
      testName();
      testNumberCard();
      testData();
      testSecurity();
  } 
})


function testName () {
  const nome = nomeTitular.value;

  if (regex.nome.test(nome)) {
    nomeTitular.classList.remove('invalid')
    
  }
  else{
    nomeTitular.classList.add('invalid')
  }
}


function testNumberCard () {  
  if(regex.numeroCartao.test(cardNumberMasked.value)){
    cardNumber.classList.remove('invalid')
  }
  else{
    cardNumber.classList.add('invalid')
  }
}


function testData() {
  if (regex.dataExp.test(expirationDateMasked.value) ) {
      expirationDate.classList.remove('invalid')
  }
   else{
      expirationDate.classList.add('invalid')
   }
}


function testSecurity () {
  if ( regex.secCode.test(securityCodeMasked.value) ) {
      securityCode.classList.remove('invalid')
  }
  else{
    securityCode.classList.add('invalid')
  }
}



const btnConfirm = document.querySelector(".btn-modal")
const btnfechar = document.querySelector(".btn-close")


function fecharModal() {
  modal.style.display="none";
  location.reload()
}

btnConfirm.addEventListener("click", () => { fecharModal()})
btnfechar.addEventListener("click", () => { fecharModal() })

