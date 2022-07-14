import React from "react";
import {Text, View, StyleSheet, BackHandler, ScrollView, Pressable, Alert, ActivityIndicator} from "react-native";
import { useTheme, ProgressBar, TextInput } from 'react-native-paper';
import HomePageTopComponent from "../../components/HomePageTopComponent";
import TextInputComponent from '../../components/TextInput';
import NativeButton from '../../components/Button';
import { auth, db } from "../../db/firebaseConfig";


const MatchedJobs = ({navigation}) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [visible, setVisible] = React.useState(true);
    const [jobs, setJobs] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(()=>{
        async function getJobs(){
            try{
                const user = await auth.currentUser;
                if(user.uid){
                    const res = await db.collection("jobs").doc("enWmo2JmRTQIifMROQuIfCNH1Ar1").get();
                    console.log("JOBS", res.data());
                    setJobs(res.data());
                }else{
                    navigation.navigate("LoginView");
                }
                setLoading(false);
            }catch(e){
                console.log("Error", e)
                setLoading(false);
                Alert.alert("Unable to fetch jobs");
            }
        }
        getJobs();
    },[]);
    const handleIconPress = () => setOpen(!open);
    const handleScrollBeginDrag = () => setVisible(false);
    const handleScrollDragEnd = () => setVisible(true);
    const viewJob = (item,index) => {
        navigation.navigate("SelectedJobProfile",{
            item
        });
    }
    const handleLogout = async() => {
    try{
      const res = await auth.signOut();
      setOpen(false);
      navigation.navigate('LoginView');
    }catch(e){
      console.log("ERROR WHILE LOGGING OUT", e);
    }
  };
    const navigateToProfile = () => {
    navigation.navigate("Profile");
  }
  console.log("JOBS JOBS", jobs?.jobs[0])
    return (
        <>
            <View>
            <HomePageTopComponent
                open={open}
                handleIconPress={handleIconPress}
                handleLogout={handleLogout}
                theme={theme}
                title="Matched Jobs"
                navigateToProfile={navigateToProfile}
            />
            <ScrollView
              onTouchStart={handleScrollBeginDrag}
              onTouchEnd={handleScrollDragEnd}
              style={styles.childContainer}
              contentContainerStyle={styles.parentContainer}
            >
            <View style={styles.parent}>
            {
                loading ? (
                    <>
                        <View style={styles.preloader}>
                            <ActivityIndicator size="large" color="#9E9E9E"/>
                        </View>
                    </>
                ):(
                    <>
                    {
                        Array.isArray(jobs?.jobs) && jobs?.jobs?.map((item,index)=>(
                             <View key={index} style={styles.jobsCard}>
                        <Pressable style={styles.jobsCard} onPress={() => viewJob(item, index)}>
                            <View style={styles.rowInfo}>
                                <Text style={styles.rowKey}>Job Title:</Text>
                                <Text style={styles.rowValue}>{item.jobTitle}</Text>
                            </View>
                            <View style={styles.rowInfo}>
                                <Text style={styles.rowKey}>Years of Experience:</Text>
                                <Text style={styles.rowValue}>{item.years}</Text>
                            </View>
                            <View style={styles.rowInfo}>
                                <Text style={styles.rowKey}>Location:</Text>
                                <Text style={styles.rowValue}>{item.location}</Text>
                            </View>
                            </Pressable>
                        </View>
                        ))
                    }
                    </>
                )
            }
            </View>
            </ScrollView>
            </View>
        </>
    )
}

export default MatchedJobs;

const styles = StyleSheet.create({
    jobsCard:{
        width:"100%",
        display:"flex",
        alignItems:"flex-start",
        justifyContent:"center",
        padding:10,
        backgroundColor:"#005248",
        borderRadius:10,
        marginTop:10
    },
    parent:{
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"flex-start",
        height:"100%",
        width:"100%",
        padding:20
    },
    rowInfo:{
        display:"flex",
        justifyContent:"center",
        flexDirection:"row",
    },
    rowKey:{
        color:"#FF8982",
        fontSize:12
    },
    rowValue:{
        fontSize:10,
        marginLeft:10,
        color:"#fff"
    },
    parentContainer: {
        alignItems: 'flex-start',
        flexGrow: 1,
        marginLeft:12,
        marginTop:20,
    },
    childContainer: {
        height: '100%',
        marginTop: 78,
    },
      preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
});