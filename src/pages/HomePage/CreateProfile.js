import React from "react";
import {Text, View, StyleSheet, BackHandler, ScrollView, Alert, Pressable, ActivityIndicator} from "react-native";
import { useTheme, ProgressBar, TextInput } from 'react-native-paper';
// import DocumentPicker from 'react-native-document-picker';
import { auth, db, storage } from "../../db/firebaseConfig";
import HomePageTopComponent from "../../components/HomePageTopComponent";
import TextInputComponent from '../../components/TextInput';
import NativeButton from '../../components/Button';

const CreateProfile = ({navigation, route}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
   const [loadingBtn, setLoadingBtn] = React.useState(false);
  const initObj = {
    firstName:"",
    lastName:"",
    years: "",
    salary: "",
    role:""
  }
  const obj = route?.params?.isEditMode ? route?.params?.profil : initObj;
  console.log("OBJECT WITH", obj)
  const [values, setValues] = React.useState({...obj});
  const [progress, setProgress] = React.useState(10);
  const handleScrollBeginDrag = () => setVisible(false);
  const handleScrollDragEnd = () => setVisible(true);
    //   React.useEffect(()=>{
    //     try{
    //       async function checkUserLoginStatus(){
    //        const userUid = await auth.currentUser;
    //        if(!userUid){
    //         navigation.navigate('LoginView');
    //         return false;
    //        }
    //       }
    //       checkUserLoginStatus();
    //     }catch(e){
    //       console.log("An error occured",e);
    //     }
    //  },[]);
    const handleBackClick = () => {
    BackHandler.exitApp();
  };
  React.useEffect(()=>{
    if(route?.params?.isEditMode){
      setValues(obj);
    }

  },[route?.params?.isEditMode]);
  React.useEffect(()=>{
    async function checkProfile(){
      try{
        console.log("GETS HERE")
        setLoading(true);
        const user = await auth.currentUser;
        console.log("USER", user)
        if(user.uid){
          const profile = await db.collection("profile").doc(user.uid).get();
          console.log("PROFILE", profile._data);
          if(profile.data()){
            navigation.navigate("Profile");
          }
        }else{
          Alert.alert("Please login");
          navigation.navigate('LoginView');
            return false;
        }
        setLoading(false);
      }catch(e){
        setLoading(false);
        console.log("ERROR",e)
        Alert.alert("Error checking profile");
      }
    }
    if(route?.params && !route?.params?.isEditMode){
      checkProfile();
    }
    setLoading(false);
  },[]);
  const navigateToProfile = () => {
    navigation.navigate("Profile");
  }
  // React.useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', handleBackClick);
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', handleBackClick);
  //   };
  // }, []);
  const handleIconPress = () => setOpen(!open);
  const handleLogout = async() => {
    try{
      await auth.signOut();
      setOpen(false);
      setValues({});
      navigation.navigate('LoginView');
    }catch(e){
      console.log("ERROR WHILE LOGGING OUT", e);
    }
  };
  const handleNavigate = async() => {
    try{
      setLoadingBtn(true);
      const user = await auth.currentUser;
      if(user.uid){
        if(route?.params?.isEditMode){
          const dt = values;
          dt.appliedJobs = route?.params?.profil.appliedJobs;
          dt.progress = "100%";
          const res = await db.collection("profile").doc(user.uid).set(dt);
          navigation.navigate("Jobs");
        }else{
          const res = await db.collection("profile").doc(user.uid).set({
            firstName:values.firstName,
            lastName:values.lastName,
            years:values.years,
            progress:"100",
            salary:values.salary,
            role: values.role
          });
          navigation.navigate("Jobs");
        }
      }else{
        Alert.alert("Please login!");
      }
      setValues({});
      setLoadingBtn(false);
    }catch(e){
       setLoadingBtn(false);
       setValues({});
      console.log("ERROR",e)
      Alert.alert("error creating your profile");
    }
  }
  const handleTextChange = (val, name) => {
    setValues({...values,[name]:val});
  }
  const uploadFile = () => {
    try{

    }catch(e){
      Alert.alert("File Upload Failed");
    }
  }
  const navigateToJobs = ()=>{
    setOpen(false);
    navigation.navigate("Jobs");
  }
  // const selectFile = async () => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.pdf],
  //     });
  //     // Printing the log realted to the file
  //     console.log('res : ' + JSON.stringify(res));
  //     // Setting the state to show single file attributes
  //     setValues({...values,"file":res});
  //   } catch (err) {
  //     setValues({...values,"file":res});
  //     // Handling any exception (If any)
  //     if (DocumentPicker.isCancel(err)) {
  //       // If user canceled the document selection
  //       Alert.alert('Canceled');
  //     } else {
  //       // For Unknown Error
  //       Alert.alert('Unknown Error: ' + JSON.stringify(err));
  //       throw err;
  //     }
  //   }
  // };
  console.log("VALUES", values)
    return (
        <View style={StyleSheet.container}>
            <HomePageTopComponent
                open={open}
                handleIconPress={handleIconPress}
                handleLogout={handleLogout}
                theme={theme}
                title={route?.params?.title || "Create Your Profile"}
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
                  <>
                      <View style={styles.preloader}>
                        <ActivityIndicator size="large" color="#9E9E9E"/>
                      </View>
                    </>
                </>
              ):(
                <>
             {/* <View style={styles.progressView}>
                <ProgressBar
                    style={styles.progressBar}
                    progress={0.7}
                    color={theme.colors.primary}
                />
                <Text style={styles.progressTxt}>{progress}%</Text>
            </View> */}
            <View style={styles.fieldsParent}>
                <TextInputComponent
                    style={styles.textInput}
                    autoComplete="off"
                    name="firstName"
                    placeholder="First Name"
                    placeholderTextColor="#955A7A"
                    selectionColor="#955A7A"
                    autoCorrect={false}
                    value={values.firstName}
                    autoFocus={true}
                    onChangeText={(val) => handleTextChange(val,"firstName")}
                />
                <TextInputComponent
                    style={[styles.textInput, styles.passwordInput]}
                    autoComplete="off"
                    placeholder="Last Name"
                    placeholderTextColor="#955A7A"
                    selectionColor="#955A7A"
                    autoCorrect={false}
                    name="lastName"
                    value={values.lastName}
                    textContentType="name"
                    onChangeText={(val) => handleTextChange(val,"lastName")}
                />
                <TextInputComponent
                    style={[styles.textInput, styles.passwordInput]}
                    autoComplete="off"
                    name="yearsOfExperience"
                    placeholder="Years of Experience"
                    value={values.years}
                    placeholderTextColor="#955A7A"
                    selectionColor="#955A7A"
                    autoCorrect={false}
                    textContentType="name"
                    onChangeText={(val) => handleTextChange(val,"years")}
                />
                <TextInputComponent
                    style={[styles.textInput, styles.passwordInput]}
                    autoComplete="off"
                    name="salary"
                    value={values.salary}
                    placeholder="Expected Salary"
                    placeholderTextColor="#955A7A"
                    selectionColor="#955A7A"
                    autoCorrect={false}
                    textContentType="name"
                    onChangeText={(val) => handleTextChange(val,"salary")}
                />
                <TextInputComponent
                    style={[styles.textInput, styles.passwordInput]}
                    autoComplete="off"
                    name="role"
                    value={values.role}
                    placeholder="Role"
                    placeholderTextColor="#955A7A"
                    selectionColor="#955A7A"
                    autoCorrect={false}
                    textContentType="name"
                    onChangeText={(val) => handleTextChange(val,"role")}
                />
                    {
                      loadingBtn ? (
                        <>
                        <View style={styles.preloader}>
                            <ActivityIndicator size="large" color="#9E9E9E"/>
                        </View>
                        </>
                      ):(
                        <>
                        <NativeButton
                          mode="contained"
                          title={route?.params?.isEditMode ? "Update" : "Submit"}
                          color={theme.colors.primary}
                          style={styles.btn}
                          onPress={()=>handleNavigate()}
                        />
                        </>
                      )
                    }
            </View>
                </>
              )
            }
            </ScrollView>
        </View>
    )
}

export default CreateProfile;

const styles = StyleSheet.create({
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
    alignItems:"center"
  },
  progressTxt: {
    color: '#000',
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
    width:"100%"
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
})