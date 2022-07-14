import React from "react";
import {Text, View, StyleSheet, BackHandler, ScrollView, Pressable,ActivityIndicator, Alert} from "react-native";
import { useTheme, ProgressBar, TextInput } from 'react-native-paper';
import HomePageTopComponent from "../../components/HomePageTopComponent";
import TextInputComponent from '../../components/TextInput';
import NativeButton from '../../components/Button';
import { auth, db } from "../../db/firebaseConfig";
import firestore from "@react-native-firebase/firestore";

const Profile = ({navigation}) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [visible, setVisible] = React.useState(true);
    const [loading, setLoading] = React.useState(true);
    const [profil, setProfile] = React.useState(null);
    React.useEffect(()=>{
        async function checkProfile(){
            try{
                const user = await auth.currentUser;
                console.log("USER", user)
                if(user.uid){
                    const profile = await db.collection("profile").doc(user.uid).get();
                    setProfile(profile.data());
                    console.log("PROFILE", profile.data());
                }else{
                    navigation.navigate("LoginViw");
                }
                setLoading(false)
            }catch(e){
                setLoading(false);
                console.log("ERROR",e);
                Alert.alert("An error occured while fetching your profile");
            }
        }
        setLoading(true);
        checkProfile();
    },[]);
    const handleIconPress = () => setOpen(!open);
    const handleScrollBeginDrag = () => setVisible(false);
    const handleScrollDragEnd = () => setVisible(true);
    const handleEdit = () => {
        navigation.navigate("CreateProfile",{
            isEditMode: true,
            profil,
            title: "Edit Profile"
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
      const navigateToJobs = ()=>{
    navigation.navigate("Jobs");
  }
    return (
        <>
            <View>
            <HomePageTopComponent
                open={open}
                handleIconPress={handleIconPress}
                handleLogout={handleLogout}
                theme={theme}
                title="Your Profile"
                navigateToProfile={navigateToProfile}
                navigateToJobs={navigateToJobs}
            />
            <ScrollView
              onTouchStart={handleScrollBeginDrag}
              onTouchEnd={handleScrollDragEnd}
              style={styles.childContainer}
              contentContainerStyle={styles.parentContainer}
            >
            {
                loading ? (
                    <>
                        <View style={styles.preloader}>
                            <ActivityIndicator size="large" color="#9E9E9E"/>
                        </View>
                    </>
                ):(
                    <>
                        <View style={styles.fieldsParent}>
                            <View style={styles.profileDits}>
                                <Text style={styles.textKey}>Name:</Text>
                                <Text style={styles.textValue}>{profil?.firstName + " " + profil?.lastName}</Text>
                            </View>
                            <View style={styles.profileDits}>
                                <Text style={styles.textKey}>Job Title:</Text>
                                <Text style={styles.textValue}>{profil?.role}</Text>
                            </View>
                            <View style={styles.profileDits}>
                                <Text style={styles.textKey}>Years of Experience:</Text>
                                <Text style={styles.textValue}>{profil?.years} years</Text>
                            </View>
                            <View style={styles.profileDits}>
                                <Text style={styles.textKey}>Expected Salary:</Text>
                                <Text style={styles.textValue}>Ksh {profil?.salary}</Text>
                            </View>
                        </View>
                        <Text style={styles.appTxt}>Applied Jobs</Text>
                        <View style={styles.applied}>
                        {
                            Array.isArray(profil?.appliedJobs) && profil?.appliedJobs.map((item,index)=>(
                                <View style={styles.card}>
                                    <View style={styles.rowInfo}>
                                        <Text style={styles.rowKey}>Job Title:</Text>
                                        <Text style={styles.rowValue}>{item.jobTitle}</Text>
                                    </View>
                                    <View style={styles.rowInfo}>
                                        <Text style={styles.rowKey}>Years of Experience:</Text>
                                        <Text style={styles.rowValue}>{item?.years}</Text>
                                    </View>
                                    <View style={styles.rowInfo}>
                                        <Text style={styles.rowKey}>Location:</Text>
                                        <Text style={styles.rowValue}>{item?.location}</Text>
                                    </View>
                                </View>
                            ))
                        }
                        </View>
                        <View style={styles.progressView}>
                            <Text onPress={()=>handleEdit()} style={styles.progressTxt}>Edit Your Profile</Text>
                        </View>
                    </>
                )
            }
            </ScrollView>
            </View>
        </>
    )
}

export default Profile;

const styles = StyleSheet.create({
    profileDits:{
        display:"flex",
        flexDirection:"row",
        gap:"2%",
        width:"100%",
        margin:12,
        alignItems:"center",
       
    },
    card:{
        width:"100%",
        display:"flex",
        alignItems:"flex-start",
        justifyContent:"center",
        padding:10,
        backgroundColor:"#005248",
        borderRadius:10,
        marginTop:10
    },
    appTxt:{
        marginTop:10
    },
    applied:{
        width:"100%",
        padding:10,
        borderRadius:10,
        backgroundColor:"#FF8982",
        marginTop:10
    },
    textKey:{
        color:"#FF8982",
        fontSize:20
    },
    textValue:{
        fontSize:16,
        marginLeft:10,
        color:"#fff"
    },
      parentContainer: {
    alignItems: 'flex-start',
    flexGrow: 1,
    marginLeft:12,
    marginTop:20,
    padding:10,

  },
  childContainer: {
    height: '100%',
    marginTop: 78,
  },
  container:{
    display:"flex",
    flexDirection:"column",
    alignItems:"flex-start",
    justifyContent:"center",
    marginTop:"100px",
    height:"100vh",
  },
  body:{
    marginTop:"30px",
    display:"flex",
    flexDirection:"column",
    alignItems:"flex-start",
    justifyContent:"center",
    marginTop:"100px",
    height:"100vh",
  },
  progressView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:"center",
    width:"100%",
    marginTop:20,
  },
  progressTxt: {
    color:"#FF8982",
    fontSize: 14,
    marginLeft: 23,
  },
    progressBar: {
    height: 3,
    width: 256,
    marginLeft: 5,
    marginTop: 11,
  },
    textInput: {
    width: 279,
    height: 51,
    borderWidth: 1,
    borderColor: '#955A7A',
    borderStyle: 'solid',
    marginTop: 40,
    paddingLeft: 22,
    backgroundColor: '#fff',
  },
  passwordInput: {
    marginTop: 20,
  },
  icon: {
    color: 'blue',
  },
  btn: {
    width: 160,
    // height: 50,
    color: '#000',
    marginTop: 36,
    fontSize: 18,
    textAlign: 'center',
    verticalAlign: 'center',
    padding: 6,
    textAlignVertical: 'center',
  },
  signUpText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  innerText: {
    textDecorationLine: 'underline',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#955A7A',
  },
  containerStyle: {
    borderWidth: 1,
    borderColor: '#955A7A',
    borderStyle: 'solid',
    marginTop: 20,
    width: 279,
    height: 51,
  },
  fieldsParent:{
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center",
    width:"100%",
     backgroundColor:"#005248",
         borderRadius:10,
         padding:10
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
});