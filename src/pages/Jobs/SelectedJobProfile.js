import React from "react";
import {Text, View, StyleSheet, BackHandler, ScrollView, Pressable, Alert, ActivityIndicator} from "react-native";
import { useTheme, ProgressBar, TextInput } from 'react-native-paper';
import HomePageTopComponent from "../../components/HomePageTopComponent";
import TextInputComponent from '../../components/TextInput';
import NativeButton from '../../components/Button';
import { auth, db } from "../../db/firebaseConfig";

const SelectedJobProfile = ({navigation,route}) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [visible, setVisible] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const handleIconPress = () => setOpen(!open);
    const handleScrollBeginDrag = () => setVisible(false);
    const handleScrollDragEnd = () => setVisible(true);
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
    const navigateToJobs = ()=>{
    navigation.navigate("Jobs");
  }
  const handleApplyJob = async () => {
    try{
        setLoading(true);
        const user = await auth.currentUser;
        if(user?.uid){
            const details = await db.collection("profile").doc(user.uid).get();
            const jobsInDb = await db.collection("jobs").doc("enWmo2JmRTQIifMROQuIfCNH1Ar1").get();
            const jdData = jobsInDb.data();
            const data = details.data();
            // console.log("DATA", jdData);
            const appliedJob = [{
                jobTitle: route?.params?.item?.jobTitle,
                location: route?.params?.item?.location,
                years: route?.params?.item?.years,
                status:"pending"
            }];
            // for(let i=0;i<jdData.jobs.length;++i){
            //     if(jdData.jobs[i].jobTitle === route?.params?.item?.jobTitle){
            //         jdData.jobs[i].applicants.push(details);
            //         break;
            //     }
            // }
            console.log("SHOULD BE UPDATED", jdData);
            if(!Object.keys(data).includes("appliedJobs")){
                const res = await db.collection("profile").doc(user.uid).update({
                            appliedJobs:appliedJob,
                        });
                // await db.collection("jobs").doc("enWmo2JmRTQIifMROQuIfCNH1Ar1").set(jdData);
            }
            else{
                console.log("DB DATA ", data)
                console.log("DB DATA TWO ", route.params)
                data.appliedJobs.push({
                    jobTitle: route?.params?.item?.jobTitle,
                    location: route?.params?.item?.location,
                    years: route?.params?.item?.years,
                    status:"pending"
                });
                console.log("UPDATED", data);
                const res = await db.collection("profile").doc(user.uid).update(data);
                // await db.collection("jobs").doc("enWmo2JmRTQIifMROQuIfCNH1Ar1").set(jdData);
            }
        }
        setLoading(false);
        return false;
    }catch(e){
        setLoading(false);
        console.log("ERRO", e);
        Alert.alert("Error applying for job");
    }
  }
    return (
        <>
            <View>
                <HomePageTopComponent
                    open={open}
                    handleIconPress={handleIconPress}
                    handleLogout={handleLogout}
                    theme={theme}
                    title={route?.params?.item?.jobTitle || "Junior Software Engineer"}
                    navigateToProfile={navigateToProfile}
                    navigateToJobs={navigateToJobs}
                />
                <ScrollView
                    onTouchStart={handleScrollBeginDrag}
                    onTouchEnd={handleScrollDragEnd}
                    style={styles.childContainer}
                    contentContainerStyle={styles.parentContainer}
                >
                    <View style={styles.parent}>
                    <View style={styles.jobsCard}>
                        <View style={styles.rowInfo}>
                            <Text style={styles.rowKey}>Job Title:</Text>
                            <Text style={styles.rowValue}>{route?.params?.item?.jobTitle}</Text>
                        </View>
                        <View style={styles.rowInfo}>
                            <Text style={styles.rowKey}>Years of Experience:</Text>
                            <Text style={styles.rowValue}>{route?.params?.item?.years}</Text>
                        </View>
                        <View style={styles.rowInfo}>
                            <Text style={styles.rowKey}>Location:</Text>
                            <Text style={styles.rowValue}>{route?.params?.item?.location}</Text>
                        </View>
                        <View>
                            <Text style={styles.description}>
                                {route?.params?.item?.description}
                            </Text>
                        </View>
                        {
                            loading ? (
                                <>
                                    <View style={styles.preloader}>
                                        <ActivityIndicator size="large" color="#9E9E9E"/>
                                    </View>
                                </>
                            ):(
                                <>
                                    <View style={styles.btnCon}>
                                        <NativeButton
                                            mode="contained"
                                            title="Apply"
                                            color={theme.colors.primary}
                                            style={styles.btn}
                                            onPress={()=>handleApplyJob()}
                                        />
                                    </View>
                                </>
                            )
                        }
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}
export default SelectedJobProfile;

const styles = StyleSheet.create({
    jobsCard:{
        width:"100%",
        display:"flex",
        alignItems:"flex-start",
        justifyContent:"center",
        padding:10,
        borderRadius:10
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
    description:{
        color:"#000",
        fontSize:13,
        marginTop: 10
    },
    rowInfo:{
        display:"flex",
        justifyContent:"center",
        flexDirection:"row",
        alignItems:"center"
    },
    rowKey:{
        color:"#FF8982",
        fontSize:16
    },
    rowValue:{
        fontSize:12,
        marginLeft:10,
        color:"#000"
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
    btnCon:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        width:"100%",
        marginTop:10
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