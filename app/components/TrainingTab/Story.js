import React, { useEffect, useState } from "react";
import { Appbar, Searchbar } from 'react-native-paper';
import { AdEventType } from '@react-native-firebase/admob';
import { FlatList, Image, ScrollView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { Button } from 'react-native-paper'

const widthR = Dimensions.get("screen").width;
const heightR = Dimensions.get("screen").height;

const Story = (props) => {
    const [selectedId, setSelectedId] = useState(null);
    const [tym, setTym] = useState(false)
    // const [story, setStory] = useState(null)
    const [temp, setTemp] = useState([])
    const [transTitle, setTransTitle] = useState(false)
    const [imgUrl, setImgUrl] = useState()
    const {story, index, UserTym , updateTym} = props.route.params
    const [countView, setCountView] = useState()
    useEffect(() => {
        console.log("updateTym", updateTym)
        setTemp([])
            getImg()
    }, [])
    
    useEffect(()=> {
        setTym(UserTym)
    },[])


   useEffect(() => {
        const curView =  database()
        .ref('stories/' + index + "/View")
        .once('value')
        .then(snapshot => {
            if(snapshot.val()) {
                setCountView(snapshot.val())
            }
            else {
                setCountView(0)
            }
            console.log("snapshot.val()", snapshot.val())
        });
      },[countView]);

    const navigation = useNavigation();
    const getImg =async()=> {
        const url = await storage()
        .ref("/Stories/" + story.Url )
        .getDownloadURL()
    setImgUrl(url)
    }
    const trans=(index)=> {
        const t = temp
        if( t[index] === 1) {
            t[index] = 0
        }
        else{
        t[index] = 1
        }
        setTemp([...t])
    }
    const speak =(content)=> {
        console.log("content", content)
    }
    const onPressTym =()=> {
        if (auth().currentUser) {
            const userId = auth().currentUser.uid;
            if (userId) {
                database()
                    .ref('users/' + userId + '/story/' + index + "/tym")
                    .set(!tym)
            }
        }
        setTym(!tym)

    }
    const Item = (props) => (
        <TouchableOpacity style={[styles.item]} onPress={()=> trans(props.index)}>
            <View style={styles.itemView}>
                <Text style={[styles.itemTitle, {color:temp[props.index] === 1 ? "green" :"#000" }]}>{ temp[props.index] !== 1 ? props.item.en : props.item.vn}</Text>
            </View>
            <TouchableOpacity style={styles.miniHeartIcon} onPress={()=> speak(props.item.en)} >
                <Image style={styles.image} source={require("../../assets/volume.jpg")} />
            </TouchableOpacity>
        </TouchableOpacity>

    );

    const _goBack = () => {
        navigation.pop()
    }
    const submit =()=> {
        setCountView(countView + 1)
        database()
            .ref('stories/' + index + "/View")
            .set(countView + 1)

        navigation.navigate("StoryTest",{
            story : story,
            indexStory: index
         })
    }
    const _handleMore = () => console.log('Shown more');
    const handleSettym = () => {
        // if(tym) {
        //     setTym(true)
        // }
        // else {
        //     setTym(false)
        // } 
        console.log("tym", tym);
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Appbar.Header style={{ backgroundColor: 'transparent', zIndex: 9 }}>
                    <Appbar.BackAction onPress={_goBack} />
                    <Appbar.Content title="" />
                    <Appbar.Action icon="dots-vertical" onPress={_handleMore} />
                </Appbar.Header>
            </View>
            <View style={styles.shadow}>
                {
               
                imgUrl ? 
                     <Image style={styles.backgroundImg} source={{ uri: imgUrl }}></Image> : null
                }
                {
                    story && story.Name ? <Text style={styles.backgroundText} onPress={()=> setTransTitle(!transTitle)}>{ !transTitle ?  story.Name.en : story.Name.vn}</Text> : null
                }

                 <TouchableOpacity style={styles.TouchText}  >
                    <Text style={styles.ViewText}>{countView ?countView: 0 }</Text>
                    </TouchableOpacity>

                <TouchableOpacity style={styles.heartIcon} onPress={() => onPressTym()} >
                    <AntDesign name={tym ? "heart" : "hearto"} color="tomato" size={30} />

                </TouchableOpacity>
            </View>
            {
                story && story.Contents ?
                    <SafeAreaView style={styles.gallery}>
                        <ScrollView >
                            {story.Contents.map((item,index) => <Item item={item} index={index}></Item>)}
                        </ScrollView>
                    </SafeAreaView> : null
            }
                    <Button style={styles.doneBtn} onPress={()=> submit()}>Tớ đọc xong rồi !</Button>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    gallery: {
        marginTop: 0,
        overflow: "scroll",
        height: 350,
    },
    item: {
        width: widthR * .8,
        marginLeft: widthR * .1,
        marginTop: 0,
        justifyContent: "center",
        flexDirection: "row",
        flexWrap:"wrap"
    },
    title: {
        fontSize: 32,
    },
    image: {
        width: 30,
        height: 30,
        opacity: .9,
    },
    text: {
        textAlign: "center",
        position: "absolute",
        fontWeight: "bold",
        width: "100%",
        bottom: 10,
        color: "#fff"
    },
    backgroundImg: {
        width: widthR,
        height: 200,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderColor: "black",
        zIndex: 1
    },
    shadow: {
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
        shadowOpacity: 1,
        backgroundColor: '#0000',
    },
    header: {
        position: "absolute",
        width: widthR
    },
    backgroundText: {
        fontWeight: "bold",
        fontSize: 16,
        padding: 10,
        margin: 20,
        textAlign: "center",
        backgroundColor:"#5de3f5",
        borderRadius:30,
        color: "#3a5f63"
    },
    heartIcon: {
        position: "absolute",
        right: 50,
        bottom: 70,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 50,
        zIndex: 900
    },
    ViewText: {
        color:"#2f5966",
        fontSize:20
    },
    TouchText : {
        position: "absolute",
        right: 110,
        bottom: 75,
        minWidth:50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#59d8ff",
        zIndex: 999,
        paddingRight:10,
        paddingLeft: 10,
        borderRadius:5
    },
    itemView: {
        marginTop: 10,
        paddingRight: 50,
        width: "100%",
        minHeight: 40,
        justifyContent: "center",
        alignContent: "center",
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "100",
        color: "#111"
    },
    itemContent: {
        fontSize: 16,
        width: 200,
        height: 80,
    },
    miniHeartIcon: {
        position: "absolute",
        right: 0,
        width: 30,
        top: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    doneBtn:{
        backgroundColor: "#d3d2f7",
         marginTop:20,
         position:"absolute",
         bottom:0,
         width: widthR,
        //  marginLeft: widthR/2 - 100
    }
});

export default Story;   