import React from "react";
import {Text, View, StyleSheet, BackHandler, ScrollView, Pressable, Alert, ActivityIndicator} from "react-native";
import { useTheme, ProgressBar, TextInput } from 'react-native-paper';
import HomePageTopComponent from "../../components/HomePageTopComponent";
import TextInputComponent from '../../components/TextInput';
import NativeButton from '../../components/Button';
import { auth, db } from "../../db/firebaseConfig";

const ViewAppliedJobs = () => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [visible, setVisible] = React.useState(true);
    const [loading, setLoading] = React.useState(true);
    const handleIconPress = () => setOpen(!open);
    const handleScrollBeginDrag = () => setVisible(false);
    const handleScrollDragEnd = () => setVisible(true);
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
            <Text>List of Jobs Applied For</Text>
            <View>
                <View style={styles.jobsCard}>
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
            </View>
            </View>
        </>
    )
}