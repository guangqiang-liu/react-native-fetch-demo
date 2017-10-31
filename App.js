/**
 * FetchNetworkDemo
 * 作者Git：https://github.com/guangqiang-liu
 * 技术交流群：620792950
 * 作者QQ：1126756952
 * @guangqiang
 */

import React, { Component } from 'react'
import {postFetch, getFetch, getFetchFromCache} from './network/request/HttpExtension'
import store from 'react-native-simple-store'

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native'

export default class App extends Component<{}> {

  fetchDataWithGET() {
    getFetch('/PageSubArea/HotPlayMovies.api', {locationId: 290}).then(response => {
      console.log(response)
    })
  }

  fetchDataWithPOST() {
    postFetch('/PageSubArea/HotPlayMovies.api', {locationId: 290}).then(response => {
      console.log(response)
    })
  }

  fetchDataWithCache() {
    store.delete('https://api-m.mtime.cn/PageSubArea/HotPlayMovies.api')
    getFetchFromCache('/PageSubArea/HotPlayMovies.api', {locationId: 290}).then(response => {
      console.log(response)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to FetchNetwork
        </Text>
        <TouchableOpacity style={{marginVertical: 20}} onPress={() => this.fetchDataWithGET()}>
          <Text>发送GET网络请求</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginVertical: 20 }} onPress={() => this.fetchDataWithPOST()}>
          <Text>发送POST网络请求</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginVertical: 20}} onPress={() => this.fetchDataWithCache()}>
          <Text>发送GET网络请求带缓存策略</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})