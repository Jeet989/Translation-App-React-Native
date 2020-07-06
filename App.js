import React, { Component } from 'react';
import { StyleSheet, Picker, Text, Image, View, SafeAreaView, TouchableHighlight, ScrollView, Linking, Button, Dimensions, TouchableOpacity } from 'react-native';
import Voice from '@react-native-community/voice';
import languages from './languages.json';
import langsecond from './langsecond.json';
import { PowerTranslator, ProviderTypes, TranslatorConfiguration, TranslatorFactory } from 'react-native-power-translator';

export default class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      languageFrom: "",
      languageTo1: "",
      languageTo2: "",
      languageCode1: 'en-US',
      languageCode2: 'en',
      inputText: "",
      outputText: "",
      submit: false,
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
    }
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }


  onSpeechError = e => {
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = e => {
    this.setState({
      inputText: e.value,
    });
    console.log(e.value[0])
  };

  _startRecognizing = async () => {
    this.setState({
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });

    try {
      await Voice.start(this.state.languageCode1);
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    var translator;
    const screenHeight = Math.round(Dimensions.get('window').height);
    const screenWidth = Math.round(Dimensions.get('window').width);
    return (

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flex: 1, flexDirection: "row", backgroundColor: '#2BB5FE', height: screenHeight / 2, width: screenWidth }}>
            <Picker
              style={{ width: 120, marginRight: 30, marginTop: Math.round(screenHeight / 9), marginLeft: 40 }}
              selectedValue={this.state.languageTo1}
              onValueChange={lang => this.setState({ languageTo1: lang, languageCode1: lang })}
            >
              {Object.keys(languages).map(key => (
                <Picker.Item label={languages[key]} value={key} />
              ))}
            </Picker>
            <Text style={{ fontSize: 20, marginTop: Math.round(screenHeight / 9) + 10, }}>To</Text>
            <Picker
              style={{ width: 120, marginLeft: 40, marginTop: Math.round(screenHeight / 9), }}
              selectedValue={this.state.languageTo2}
              onValueChange={lang => this.setState({ languageTo2: lang, languageCode2: lang })}

            >
              {Object.keys(langsecond).map(key => (
                <Picker.Item label={langsecond[key]} value={key} />
              ))}
            </Picker>
            <ScrollView
              persistentScrollbar={false}
              style={{ marginLeft: -350, marginTop: 150, marginRight: 30, marginBottom:25 }}>
              <Text style={{ ...styles.text, marginLeft: 10, textAlign: 'center', marginTop: 0 }}>
                {this.state.inputText[0]}
              </Text>
            </ScrollView>



          </View>

          <View style={{ flex: 1 ,marginBottom:0}}>
            <View style={{marginTop: -screenHeight / 2 * .0555,}}>
              <TouchableOpacity onPress={this._startRecognizing}>
                <Image
                  source={require('./microphone.png')}
                  style={{ ...styles.button, left:0 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flex:.1, marginTop:0, marginBottom:20}}>
            
            <ScrollView style={{marginTop:-360, textAlign:'center', marginLeft:10}}>
          {TranslatorConfiguration.setConfig(ProviderTypes.Google, 'AIzaSyC-_c29hLIsTAiogU0XT_DYu11aXwlqHnA', this.state.languageCode2)}
          <PowerTranslator text={this.state.inputText[0]}
                style={{ ...styles.text,textAlign: 'center', marginTop: 0, marginLeft:9, marginRight:20 }}
              />
        
            </ScrollView>


          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 25,
    marginTop: 220,
    marginLeft: -300
  },
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },  
});