import {createContext, useState} from 'react';

export const AuthContext = createContext({
  token: '',
  userName1: '',
  currentPageName: '',
  currentPlantName: '',
  currentPlantCode: '',
  isAuthenticated: false,
  IsServiceSent: false,
  isTruckFound: false,
  TagArray: '',
  authenticate: token => {},
  UserName: user => {},
  logout: () => {},
  Pagehandler: Page => {},
});

function AuthContextProvider({children}) {
  const [authToken, setAuthToken] = useState();
  const [userName1, setUserName1] = useState();
  const [currentPage, setcurrentPage] = useState();
  const [TruckFound, setTruckFound] = useState();
  const [TagArray, setTagArray] = useState();

  function authenticate(token) {
    setAuthToken(token);
  }

  function isTruckFound(token) {
    setTruckFound(token);
  }

  function logout() {
    setAuthToken(null);
  }

  function UserName(user) {
    setUserName1(user);
  }

  const value = {
    token: authToken,
    userName1: userName1,
    isAuthenticated: !!authToken,
    currentPageName: currentPage,
    authenticate: authenticate,
    isTruckFound: TruckFound,
    TagArray: TagArray,
    UserName: UserName,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
