import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import React, { useState, useEffect, useRef, useMemo } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation';


export default function App() {
  
const [data, setData] = useState(null);
const [readingAmount, setReadingAmount] = useState(2);
const HideKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
  );

  
  useEffect(() => {
    fetch('http://192.168.236.132/reactnativefetch.php')
      .then(response => response.json())
      .then(jsonData => {
        const chartData = {
          labels: [],
          datasets: [
            {
              data: []
            }
          ]
        };

        for (let i = jsonData.length - 1; i >= jsonData.length - readingAmount; i--) {
          const item = jsonData[i];
          chartData.labels.push(item.time);
          chartData.datasets[0].data.push(item.result);
        }
        setData(chartData);
      });
  }, [readingAmount]);

  if (!data) {
    return null;
  }

    const chartConfig = {
    backgroundGradientFrom: '#28b4ee',
    backgroundGradientTo: '#c228ee',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
  };

  return (
    <HideKeyboard>
    <View style={styles.container}>
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.input}
          placeholder='How many readings?'
          keyboardType='numeric'
          onChangeText={(readingAmount) => {
            if (readingAmount === '') {
              setReadingAmount(2); // set default value when input is empty
            } else {
              const number = parseInt(readingAmount, 10);
              if (number < 2) {
                setReadingAmount(2);
              } else if (number > 100) {
                setReadingAmount(100);
              } else {
                setReadingAmount(number);
              }
            }
          }}
        >
        </TextInput>
      </View>
      
      <LineChart
          style={styles.chart}
          data={data}
          width={Dimensions.get('window').width - 20} // from react-native
          height={Dimensions.get('window').height - 400}
          bezier
          xLabelsOffset={100}
          segments={3}
          withInnerLines={false}
          withVerticalLabels={false}
          chartConfig={chartConfig}
      />
        <TouchableOpacity
          style={styles.button}
          onPress={() => { setReadingAmount(3); }}
        >
          <Text style={styles.buttonText}>
          Most Recent
          </Text>
        </TouchableOpacity>
      <StatusBar style="auto" />
      </View>
    </HideKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
    InputContainer: {
    width: '80%',
    shadowColor: '#171717',
    marginBottom: '10%',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  input: {
    backgroundColor: 'white',
    marginTop: "20%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 75,
  },
    button: {
    marginTop: "10%",
    height: 50,
    width: 200,
    backgroundColor: '#28b4ee',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  buttonText: {
    fontWeight: 'regular',
    fontSize: 22,
    color: '#fff',
  },  
  chart: {
   borderRadius: 20,
  },  
});
