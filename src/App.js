import React, {useState, useEffect} from 'react';
import { ThemeProvider, CssBaseline, createMuiTheme, LinearProgress } from '@material-ui/core';
import AppBarContent from './components/Appbar/index';
import AppContainer from './app/GridState/App';
import Query from './app/GetData/querys';
import 'typeface-roboto';

const query = new Query();

const theme = createMuiTheme({
  typography:{
    fontFamily:[
      "Roboto"
    ]
  }
});


function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

    async function getDataQuery(){
        await setIsLoading(true);
        const responseData = await query.getAllCountries();
        await setData(responseData);
        await setIsLoading(false);
    }

    useEffect(() => {
        getDataQuery();
    },[]);

  return (
    <div>
      <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AppBarContent 
      getData={() => getDataQuery()}/>
      <div style={{
        height:"65px"
      }}/>
      {isLoading === true && <LinearProgress variant="query"/>}
      <AppContainer 
      getData={() => getDataQuery()}
      isLoading={isLoading}
      data={data}/>
      </ThemeProvider>
    </div>
  );
}

export default App;
