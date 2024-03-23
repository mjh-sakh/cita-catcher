// document.location = "https://icp.administracionelectronica.gob.es/icpplus/index.html"
// --------------------------- CITY CONSTANTS ----------------------------------
const VALENCIA = "/icpplus/citar?p=46&locale=es"
const GRANADA = "/icpplus/citar?p=18&locale=es"
const TARRAGONA = "/icpplus/citar?p=43&locale=es"
const BARCELONA = "/icpplustieb/citar?p=8&locale=es"
// ------------------------- SERVICES CONSTANTS --------------------------------
const ASIGNACION_DE_NIE = "4031"
const AUTORIZACION_DE_REGRESO = "20"
const RECOGIDA_DE_TARJETA_DE_IDENTIDAD_DE_EXTRANJERO_TIE = "4036"
const EXPEDICION_RENOVACION_DE_DOCUMENTOS_DE_SOLICITANTES_DE_ASILO = "4067"
const CARTA_DE_INVITACION = "4037"
const CERTIFICADO_DE_REGISTRO_DE_CIUDADANO_DE_LAUE = "4038"
const CERTIFICADOS_DE_RESIDENCIA_DE_NO_RESIDENCIA_Y_DE_CONCORDANCIA_ = "4049"
const CERTIFICADOS_Y_ASIGNACION_NIE = "4096"
const TOMA_DE_HUELLA = "4010"
// ------------------------------ COUNTRIES ------------------------------------
const RUSSIA = "149"
const BELARUS = "144"
const UCRANIA = "152"
const KAZAJSTAN = "146"
// --------------------------- CONFIGURATIONS ----------------------------------
const CITY = VALENCIA
const SERVICE = TOMA_DE_HUELLA
const COUNTRY = RUSSIA
const NAME = "<Your name>" // e.g. Migrant Migrantov
const NIE = "<Z1234567H>" // e.g. Z1234567H
const PHONE = "<12345678>"
const EMAIL = "email@gmail.com"

// ------------------------------ FUNCTIONS ------------------------------------
function setIfPresent(id, value) {
  const element = document.getElementById(id)
  if (element) {
    element.value = value
    return true;
  }
  return false;
}

function clickIfPresent(id) {
  const enterButton1 = document.getElementById(id);
  if (enterButton1) {
    enterButton1.click()
  }
}

function isLocation(location) {
  return document.location.pathname === location
}
// ----------------------------- MAIN LOGIC ------------------------------------
// MAIN PAGE
if (isLocation("/icpplus/index.html") || isLocation("/icpplus/index")) {
  setIfPresent("form", CITY)
  clickIfPresent("btnAceptar")
}

// SERVICE PAGE
if (isLocation("/icpplus/citar")) {
  setIfPresent("tramiteGrupo[0]", SERVICE)
  clickIfPresent("btnAceptar")
}

// INFO PAGE
if (isLocation("/icpplus/acInfo")) {
  clickIfPresent("btnEntrar")
}

// PERSONAL INFO
setIfPresent("txtPaisNac", COUNTRY)
setIfPresent("txtIdCitado", NIE)
if (setIfPresent("txtDesCitado", NAME)) {
  clickIfPresent("btnEnviar")
}

if (isLocation("/icpplus/acValidarEntrada")) {
  clickIfPresent("btnEnviar")
}

// CONTACTS
setIfPresent("txtTelefonoCitado", PHONE)
setIfPresent("emailUNO", EMAIL)
setIfPresent("emailDOS", EMAIL)

