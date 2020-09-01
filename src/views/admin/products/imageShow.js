import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import { getProduct, getPackage, getOrigins, getTaxes, getUnits, getProducts } from "../../_redux_/productsSlice";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: "100%",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

export default function ImageShow() {
    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const [product, setProduct] = useState([])
    const classes = useStyles();
    const history = useHistory();
    let location = useLocation();
    const [expanded, setExpanded] = React.useState(false);
    useEffect(() => {
       
        getProducts(ids, "en").then(result => setProduct(result.data))
    }, [location]);

    function check(image){
        if(image !== undefined){
           return JSON.parse(image )
        }
    }
    const image = check(product.images)?.original
    const linkImage = `http://139.180.207.4:84/storage/${image}`

    return (
        <Card className={classes.card}>
            {/* <CardHeader

            /> */}
            <CardContent>
                <img src ={`http://139.180.207.4:84/storage/${image}`} style={{width: "100%", height: "340px"}}></img>
            </CardContent>
            
        </Card>
    );
}