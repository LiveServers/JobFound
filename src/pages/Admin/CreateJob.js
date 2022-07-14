import  React from "react";
import {Text, View, StyleSheet, BackHandler, ScrollView, Pressable, Alert, ActivityIndicator} from "react-native";
import { useTheme, ProgressBar, TextInput } from 'react-native-paper';
import HomePageTopComponent from "../../components/HomePageTopComponent";
import TextInputComponent from '../../components/TextInput';
import NativeButton from '../../components/Button';
import { auth, db } from "../../db/firebaseConfig";

const CreateJob = ({navigation}) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [visible, setVisible] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [values, setValues] = React.useState();
    const handleIconPress = () => setOpen(!open);
    const handleScrollBeginDrag = () => setVisible(false);
    const handleScrollDragEnd = () => setVisible(true);
          const navigateToProfile = () => {
    navigation.navigate("Profile");
  }
      const navigateToJobs = ()=>{
    navigation.navigate("Jobs");
  }
    const handleTextChange = (val, name) => {
    setValues({...values,[name]:val});
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
  const createJob = async () => {
    try{
        setLoading(true);
        const user = await auth.currentUser;
        if(user.uid){
            const jobData = await db.collection("jobs").doc(user.uid).get();
            const data = jobData.data();
            if(!Object.keys(data).includes("jobs")){
                const jobs = [values];
                const res = await db.collection("jobs").doc(user.uid).set({
                    jobs
                });
                setValues({});
                Alert.alert("Job created successfully");
            }else{
                data.jobs.push(values);
                const res = await db.collection("jobs").doc(user.uid).set(data);
                setValues({});
                Alert.alert("Job created successfully");
            }
        }else{
            setValues({});
            navigation.navigate("LoginView");
        }
        setLoading(false);
        setValues({});
    }catch(e){
        setLoading(false);
        setValues({});
        console.log("ERROR", e);
        Alert.alert("Failed to create job alert!")
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
                        title="Create Job Alert"
                        navigateToProfile={navigateToProfile}
                        navigateToJobs={navigateToJobs}
                    />
                                <ScrollView
              onTouchStart={handleScrollBeginDrag}
              onTouchEnd={handleScrollDragEnd}
              style={styles.childContainer}
              contentContainerStyle={styles.parentContainer}
            >
                    <View style={styles.container}>
                        <TextInputComponent
                            style={[styles.textInput]}
                            autoComplete="off"
                            name="jobTitle"
                            // value={values.role}
                            placeholder="Job Title"
                            placeholderTextColor="#955A7A"
                            selectionColor="#955A7A"
                            autoCorrect={false}
                            textContentType="name"
                            onChangeText={(val) => handleTextChange(val,"jobTitle")}
                        />
                        <TextInputComponent
                            style={styles.textInput}
                            autoComplete="off"
                            name="years"
                            placeholder="Years of Experience"
                            placeholderTextColor="#955A7A"
                            selectionColor="#955A7A"
                            autoCorrect={false}
                            // value={values.title}
                            autoFocus={true}
                            onChangeText={(val) => handleTextChange(val,"years")}
                        />
                        <TextInputComponent
                            style={[styles.textInput, styles.passwordInput]}
                            autoComplete="off"
                            placeholder="Location"
                            placeholderTextColor="#955A7A"
                            selectionColor="#955A7A"
                            autoCorrect={false}
                            name="location"
                            // value={values.lastName}
                            textContentType="name"
                            onChangeText={(val) => handleTextChange(val,"location")}
                        />
                        <TextInputComponent
                            style={[styles.textInput]}
                            autoComplete="off"
                            name="description"
                            placeholder="Job Descrption"
                            // value={values.years}
                            placeholderTextColor="#955A7A"
                            selectionColor="#955A7A"
                            autoCorrect={false}
                            textContentType="name"
                            onChangeText={(val) => handleTextChange(val,"description")}
                        />
                        {
                            loading ? (
                                <>
                                <View style={styles.preloader}>
                                    <ActivityIndicator size="large" color="#9E9E9E"/>
                                </View>
                                </>
                            ):(
                                <>
                                <NativeButton
                                    mode="contained"
                                    title="Create Job"
                                    color={theme.colors.primary}
                                    style={styles.btn}
                                    onPress={()=>createJob()}
                                />
                                </>
                            )
                        }
                    </View>
                    </ScrollView>
            </View>
        </>
    )
}

export default CreateJob;

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
    container: {
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center",
    width:"100%"
  },
  loginTitle: {
    marginTop: 109,
    fontSize: 24,
    textAlign: 'center',
  },
  textInput: {
    width: 279,
    height: 51,
    borderWidth: 1,
    borderColor: '#955A7A',
    borderStyle: 'solid',
    marginTop: 48,
    backgroundColor: '#fff',
    paddingLeft: 22,
  },
  passwordInput: {
    marginTop: 20,
  },
  icon: {
    color: 'blue',
  },
  btn: {
    width: 129,
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
  },
  innerText: {
    textDecorationLine: 'underline',
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