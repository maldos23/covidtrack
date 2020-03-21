import React, { useEffect, useState } from 'react';
import MenuBar from '../../components/MenuBar/index';
import Chart from '../../components/Charts/index';
import { Grid, makeStyles, Typography, Card, CardContent, Hidden, CardHeader, Dialog, DialogTitle, DialogActions, Button, DialogContent, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListSubheader } from '@material-ui/core';
import MaterialTable  from 'material-table';
import { SearchRounded, ClearRounded, FirstPageRounded, CheckRounded, RemoveRounded, LastPageRounded, ChevronRightRounded, ChevronLeftRounded, ArrowUpwardRounded, SaveAltRounded } from '@material-ui/icons';

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
    },
    dialogTitle:{
        background:"linear-gradient(to right, #8e2de2, #4a00e0)", 
        color:"#FFF"
    }
}));

function Main(props){
    const classes = useStyle();
    const [selection, setSelection] = useState(0);
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
                    {selection === 1 && <TableCountries total={data} data={props.data} isLoading={props.isLoading}/>}
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

function AllDataDashboard(props){

    const {data} = props;

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
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState({});
    const classes = useStyle();
    const squemaTable = [
        {field:"country", title:"Country"},
        {field:"cases", title:"Cases"},
        {field:"todayCases", title:"Today Cases"},
        {field:"deaths", title:"Deaths"},
        {field:"todayDeaths", title:"Today Deaths"},
        {field:"recovered", title:"Recovered"},
        {field:"critical", title:"Critical"},
    ];

    return(
        <div>
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
        columns={squemaTable}
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
            SortArrow:ArrowUpwardRounded,
            Export:SaveAltRounded
        }}
        onRowClick={async(e, content) => {
            await setPreview(content);
            await setOpen(true);
        }}
        options={{
            exportFileName:"CovidReport",
            exportAllData:true,
            exportButton:true,
            maxBodyHeight:"calc(100vh - 220px)",
            pageSize:50,
            pageSizeOptions:[50]
        }}
        />
        <Dialog
        fullWidth
        maxWidth="sm"
        onClose={() => setOpen(false)}
        open={open}>
            <DialogTitle className={classes.dialogTitle}>
                Global comparison of cases
            </DialogTitle>
            <DialogContent>
            <List>
                <ListSubheader 
                style={{
                    background:"#FFF",
                    fontSize:"18px"
                }}>
                    {`${preview.country} vs World`}
                </ListSubheader>
                {
                    squemaTable.map(function(item,index){
                        if(typeof preview[item.field] === "number"){
                            return(
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                    <Avatar 
                                    style={{
                                        fontWeight:"bold",
                                        fontSize:"14px",
                                        background:"#8e2de2",
                                        width:50,
                                        height:50,
                                        marginRight:"5px"
                                    }}>
                                        {`${parseFloat((preview[item.field]/props.total[item.title])*100).toFixed(1)}%`}
                                    </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                    primaryTypographyProps={{
                                        color:"secondary",
                                        style:{
                                            fontWeight:"bold"
                                        }
                                    }}
                                    primary={item.title} 
                                    secondary={preview[item.field]}/>
                                </ListItem>
                            )
                        }
                    })
                }
            </List>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={() => setOpen(false)}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        </div>
    )
}

export default Main;