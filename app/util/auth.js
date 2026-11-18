import axios from 'axios';
// import  { AuthContext } from "../store/auth-context";
// import { useContext } from "react";

const API_KEY = 'AIzaSyDCYasArcOwcALFhIj2szug5aD2PgUQu1E';
// const baseurl = "http://192.168.0.112:84";

var baseurl = [];
baseurl['1320'] = 'http://10.111.22.19:85/RGP';
baseurl['1324'] = 'http://10.111.22.19:85/RGD';
baseurl['1321'] = 'http://10.120.22.16:85/KCW';
baseurl['1325'] = 'http://10.120.22.16:85/KCW';
baseurl['1360'] = 'http://10.137.22.13:85/CCW';
baseurl['6300'] = 'http://10.107.22.19:85/GCW';
baseurl['1340'] = 'http://10.103.22.19:85/MGH';
baseurl['1302'] = 'http://10.110.22.19:85/ALR';
baseurl['1322'] = 'http://10.121.22.19:85/BCW';
baseurl['1300'] = 'http://10.109.22.19:85/BGM';
baseurl['1323'] = 'http://10.133.22.19:8585/JCW';
baseurl['1328'] = 'http://10.133.22.19:8585/JCW';
baseurl['1303'] = 'http://10.106.22.19:85/KDP';
baseurl['1329'] = 'http://10.117.22.19:85/RCW';
baseurl['1301'] = 'http://10.108.22.19:85/DPM';
baseurl['3300'] = 'http://10.104.22.19:85/LCW';
baseurl['3307'] = 'http://10.104.22.19:85/LCW';
baseurl['3301'] = 'http://10.102.22.16:85/USO';
baseurl['4301'] = 'http://10.140.22.19:85/MCW';
baseurl['1093'] = 'http://172.17.1.32:85/CNR';
baseurl['0000'] = 'http://192.168.0.137:85/JCW';

var plantshortlist = [];
plantshortlist['1320'] = 'RGP';
plantshortlist['1324'] = 'RGD';
plantshortlist['1321'] = 'KCW';
plantshortlist['1325'] = 'KCW';
plantshortlist['1360'] = 'CCW';
plantshortlist['6300'] = 'GCW';
plantshortlist['1340'] = 'MGH';
plantshortlist['1302'] = 'ALR';
plantshortlist['1322'] = 'BCW';
plantshortlist['1300'] = 'BGM';
plantshortlist['1323'] = 'JCW';
plantshortlist['1328'] = 'JCW';
plantshortlist['1303'] = 'KDP';
plantshortlist['1329'] = 'RCW';
plantshortlist['1301'] = 'DPM';
plantshortlist['3300'] = 'LCW';
plantshortlist['3307'] = 'LCW';
plantshortlist['3301'] = 'USO';
plantshortlist['4301'] = 'MCW';
plantshortlist['1093'] = 'CNR';
plantshortlist['0000'] = 'ACC';

// const authCtx1 = useContext(AuthContext);

async function authenticate(plantCode, email, password) {
  // console.log(plantCode);
  try {
    // const url = "http://10.0.2.2/UserAccess/checkUserCredential";
    const url = baseurl[plantCode] + '/UserAccess/checkUserCredential';
    console.log(url);
    var params = {
      plantCode: plantCode,
      userName: email,
      password: password,
    };
    
    const response = await axios.post(url, params);
    const token = response.data;
    return token;
  } catch (err) {
    let token = {};
    token.status = 'Error';
    token.RFID = '';
    token.truckno = '';
    token.Desc = 'Error in clearToken:' + err.message;
    return token;
  }
}

export function login(plantCode, email, password) {
  return authenticate(plantCode, email, password);
}

async function clearToken(plantCode, email) {
  try {
    const url = baseurl[plantCode] + '/UserAccess/clearToken';
    var params = {
      plantCode: plantCode,
      userName: email,
    };
    const response = await axios.post(url, params, {
      timeout: 5000, // Timeout in milliseconds
    });
    let token = {};
    token.status = 'SUCCESS';
    token.RFID = '';
    token.truckno = '';
    token.Desc = response.data;
    return token;
  } catch (err) {
    let token = {};
    token.status = 'Error';
    token.RFID = '';
    token.truckno = '';
    if (err.code === 'ECONNABORTED') {
      token.Desc = 'Error: Request timed out after 5 seconds';
    } else {
      token.Desc = 'Error in clearToken: ' + err.message;
    }
    return token;
  }
}

export function logoutandcleartoken(plantCode, email) {
  return clearToken(plantCode, email);
}

function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
async function getTruckdata(payLoad) {
  // console.log('Request Truck number for '+ TagNo);
  const url =
    baseurl[payLoad.plantID] + '/PlantApiServiceHandHeld/APIGateService';
  var params = {
    identifier: payLoad.identifier,
    MultiTag: payLoad.MultiTag,
    plant: plantshortlist[payLoad.plantID],
    plantID: payLoad.plantID,
    tagID: payLoad.TagId,
  };
  console.log(url, params);
  // return;
  const response = await axios.post(url, params);

  let token = {};
  if (!isJSON(response.data)) {
    token.status = 'FAILURE';
    token.RFID = '';
    token.truckno = '';
    token.Desc = response.data;
    return token;
  }

  try {
    token = JSON.parse(response.data);
    // console.log(token);
    if (token.d == undefined) {
      token.status = 'FAILURE';
      token.RFID = '';
      token.truckno = '';
      token.Desc = JSON.stringify(response.data);
    } else {
      token.status = token.d.message;
      token.RFID = token.d.Data[0].RFID;
      token.truckno = token.d.Data[0].truckno;
      token.Desc = token.d.Data[0].Desc + ' for Truck No - ' + token.truckno;
    }
  } catch (error) {
    token.status = 'FAILURE';
    token.RFID = '';
    token.truckno = '';
    token.Desc = response;
    return token;
  }

  return token;
}

export function getTruckNo(plantCode, TagNo) {
  return getTruckdata(plantCode, TagNo);
}

async function postTruckRegisttration(payLoad) {
  // console.log(payLoad);
  const url =
    baseurl[payLoad.plantID] + '/PlantApiServiceHandHeld/APITruckRegService';

  // console.log(url);
  const response = await axios.post(url, payLoad);
  // console.log(response);
  let token = {};

  try {
    token = JSON.parse(response.data);
    console.log(token);
    if (token.d == undefined) {
      token.status = 'FAILURE';
      token.RFID = '';
      token.truckno = '';
      token.Desc = JSON.stringify(response.data);
    } else {
      token.status = token.d.message;
      token.RFID = token.d.Data[0].RFID;
      token.truckno = token.d.Data[0].truckno;
      token.Desc = token.d.Data[0].Desc + ' for Truck No - ' + token.truckno;
    }
  } catch (error) {
    token.status = 'FAILURE';
    token.RFID = '';
    token.truckno = '';
    token.Desc = JSON.stringify(response.data);
    return token;
  }

  return token;
}

export function sendTruckRegisttration(data) {
  return postTruckRegisttration(data);
}

async function getPlantNameFromApi(plantCode) {
  const url = baseurl[plantCode] + '/ApiHandler/appGetPlantName';
  const response = await axios.post(url);
  const token = response.data;
  return token;
}

export function getPlantName(plantCode) {
  return getPlantNameFromApi(plantCode);
}
