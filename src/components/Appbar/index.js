import React, { Fragment } from 'react';
import { AppBar, Toolbar, Typography, makeStyles, IconButton } from '@material-ui/core';
import { DeviceHubRounded, GitHub, RefreshRounded } from '@material-ui/icons';

const useStyle = makeStyles(theme => ({
    backgroundBar:{
        background:"linear-gradient(to right, #8e2de2, #4a00e0)",
        color:"#FFFFFF",
        boxShadow:"none",
        borderBottomLeftRadius:"50px"
    },
    icon:{
        height:35,
        width:35
    }
}))

function Main(props){
    const classes = useStyle();
    return(
        <Fragment>
            <AppBar className={classes.backgroundBar}>
                <Toolbar>
                <DeviceHubRounded className={classes.icon}/>
                <Typography
                variant="h5">
                    <b>Covid</b> Track
                </Typography>
                <div style={{flexGrow:1}}/>
                <IconButton onClick={() => props.getData()}>
                    <RefreshRounded style={{color:"#FFF"}}/>
                </IconButton>
                <IconButton href="https://github.com/maldos23/covidtrack">
                    <GitHub style={{color:"#FFF"}}/>
                </IconButton>
                </Toolbar>
            </AppBar>
        </Fragment>
    )
}

export default Main;