import React, { useEffect, useState } from 'react';
import MenuBar from '../../components/MenuBar/index';
import Chart from '../../components/Charts/index';
import { Grid, makeStyles, Typography, Card, CardContent, Hidden, CardHeader } from '@material-ui/core';
import MaterialTable  from 'material-table';
import { SearchRounded, ClearRounded, FirstPageRounded, CheckRounded, RemoveRounded, LastPageRounded, ChevronRightRounded, ChevronLeftRounded, ArrowUpwardRounded } from '@material-ui/icons';

const useStyle = makeStyles(theme => ({
    margin:{
        margin:theme.spacing(1)
    },
    root:{
        flexGrow:1
    },
    marginTitle:{
        margin:theme.spacing(2),
        color:"#FFF"
    },
    tableTitle:{
        background:"linear-gradient(to right, #8e2de2, #4a00e0)",
        borderBottomLeftRadius:"25px",
    }
}));

function Main(props){
    const classes = useStyle();
    const {data} = props;
    const [selection, setSelection] = useState(0);

    return(
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12} sm={3} md={2}>
                    <Hidden xsDown>
                    <div style={{
                        height:"100px"
                    }}/>
                    </Hidden>
                    <div>
                    <MenuBar handleValue={(value) => setSelection(value)} countries={data.length} />
                    </div>
                </Grid>
                <Grid item xs={12} sm={9} md={10}>
                    <div className={classes.margin}>
                    {selection === 0 && <AllDataDashboard data={data} isLoading={props.isLoading}/>}
                    {selection === 1 && <TableCountries data={data} isLoading={props.isLoading}/>}
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

function AllDataDashboard(props){

    const [data, setData] = useState([]);

    async function CreateDash(params){
        var prevTotals = {};
        var totals = {};
        var keys = [
            {field:"cases", title:"Cases",isSum:false},
            {field:"todayCases",title:"Today Cases",isSum:true},
            {field:"deaths",title:"Deaths",isSum:true},
            {field:"todayDeaths",title:"Today Deaths",isSum:true},
            {field:"recovered",title:"Recovered",isSum:true},
            {field:"critical",title:"Critical",isSum:true}
        ];
        
        await keys.map(async(item) => prevTotals[item.field] = await params.reduce((total, currentValue) => (total + currentValue[item.field]),0));
        
        await Object.keys(prevTotals).map(async(item) => {
            if(typeof prevTotals[item] === "number"){
                var identy = keys.filter((key)=> key.field === item);
                totals[identy[0].title] = prevTotals[item];
            }
        });

        await setData(totals);
    }

    useEffect(()=>{
        if(props.data.length > 0){
            CreateDash(props.data);
        }
    },[props.data]);

    return(
        <Grid container spacing={2}>
            {Object.keys(data).length > 0 &&
                Object.keys(data).map((item,index) => (
                <Grid key={index} item xs={12} md={6} sm={4}>
                    <Card>
                        <CardHeader 
                        title={item}
                        subheader={`Total: ${data[item]}`}/>
                        <CardContent style={{textAlign:"center"}}>
                            <Typography 
                            variant="h3"
                            style={{
                                background:"linear-gradient(to top, #ee0979, #ff6a00)",
                                WebkitBackgroundClip:"text",
                                WebkitTextFillColor:"transparent"
                            }}>
                                <b>{`${parseFloat((data[item]/data.Cases)*100).toFixed(2)}%`}</b>
                            </Typography>
                        </CardContent>
                        <CardContent style={{textAlign:"center",display:"block"}}>
                            <Chart 
                            index={index}
                            data={[
                                {
                                    title:"Cases",
                                    value:data.Cases
                                },
                                {
                                    title:item,
                                    value:data[item]
                                }
                            ]}/>
                        </CardContent>
                    </Card>
                </Grid>
                ))
            }
            
        </Grid>
    )
}

function TableCountries(props){
    const classes = useStyle();
    return(
        <MaterialTable
        isLoading={props.isLoading}
        title={
            <div className={classes.tableTitle}>
                <Typography 
                className={classes.marginTitle} 
                variant="h5">
                    Countries
                </Typography>
            </div>
        }
        components={{
        Container:props => (
            <Card>
                <CardContent>
                    <div {...props} style={{height:"calc(100vh - 125px)"}}/>
                </CardContent>
            </Card>
        ),
        }}
        data={props.data}
        columns={[
            {field:"country", title:"Country"},
            {field:"cases", title:"Cases"},
            {field:"todayCases", title:"Today Cases"},
            {field:"deaths", title:"Deaths"},
            {field:"todayDeaths", title:"Today Deaths"},
            {field:"recovered", title:"Recovered"},
            {field:"critical", title:"Critical"},
        ]}
        icons={{
            Search:SearchRounded,
            Clear:ClearRounded,
            FirstPage:FirstPageRounded,
            Check:CheckRounded,
            ThirdStateCheck:RemoveRounded,
            LastPage:LastPageRounded,
            Delete:ClearRounded,
            NextPage:ChevronRightRounded,
            PreviousPage:ChevronLeftRounded,
            ResetSearch:ClearRounded,
            SortArrow:ArrowUpwardRounded
        }}
        options={{
            maxBodyHeight:"calc(100vh - 220px)",
            pageSize:50,
            pageSizeOptions:[50]
        }}
        />
    )
}

export default Main;