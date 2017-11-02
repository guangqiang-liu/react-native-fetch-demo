# react-native-fetch-demo
自定义ReactNative中的fetch网络请求组件

# 前言
> 作为前端开发人员，网络请求工具对大家来说肯定不陌生。iOS的AFNetworking，Android的okHttp等。但是对于RN来说，我们最常用到的就是js原生的Fetch请求了。下面的这篇文章我们主要就是来聊聊Fetch请求的简单使用以及如何封装一个fetch网络请求组件和缓存策略。
> ### 查看作者简书对fetch请求详解请点击[http://www.jianshu.com/p/df4f13ba486b](http://www.jianshu.com/p/df4f13ba486b)

# 什么fetch
> fetch 是由 whatag 负责研发。与 Ajax 不同的是，它的 API 不是事件机制，而是采用目前流行的 Promise(MDN Promise) 方式处理

#### 查看ReactNatie官方对于fetch的讲解请点击：[http://reactnative.cn/docs/0.49/network.html#content](http://reactnative.cn/docs/0.49/network.html#content)

### fetch请求的格式

```
 fetch(url, init)
    .then((response) => { // 数据解析方式
    })
    .then((responseData) => { // 获取到的数据处理
    })
    .catch((error) => { // 错误处理
    })
    .done(); // 结束链式
```

**在上面的示例中`init `是一个对象，对象中包含如下属性：**

* method：网络请求的方式(GET、POST等)
* headers：网络请求的请求头对象，对象中包含(Accept、Content-Type、token等属性)
* body：POST请求的请求体对象，即需要往服务器发送的数据
* mode：跨域设置(cors, no-cors, same-origin) *不常用*
* cache：缓存选项（default, no-store, reload, no-cache, force-cache, or only-if-cached）*不常用*

####  `response ` 对象可以有如下几种解析方式：

* json()
* text()
* arrayBuffer()
* blob()
* formData()

# 如何使用fetch

### GET请求

```
fetch(url, {
		method: 'GET',
      	headers: {
      		'Accept': 'application/json',
  			'Content-Type': 'application/json',
      	}
	})
    .then((response) => response.json()) // json方式解析，如果是text就是response.text()
    .then((responseData) => { // 获取到的数据处理
    })
    .catch((error) => { // 错误处理 
    })
    .done()
```

### POST请求

```
fetch(url, {
        method: "POST",
        headers: {
        	'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
        body: JSON.stringify({key1: value1, key2: value2})
    })
    .then((response) => { // 数据解析方式
    })
    .then((responseData) => { // 获取到的数据处理
    })
    .catch((error) => { // 错误处理
    })
    .done()
```

# 作者封装的fetch请求组件核心源码如下

```
/**
 * IconFontDemo
 * 作者Git：https://github.com/guangqiang-liu
 * 技术交流群：620792950
 * 作者QQ：1126756952
 * @guangqiang
 */

/** 基于fetch 封装的网络请求工具类 **/

import {Component} from 'react'

/**
 * fetch 网络请求的header，可自定义header 内容
 * @type {{Accept: string, Content-Type: string, accessToken: *}}
 */
let header = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

/**
 * GET 请求时，拼接请求URL
 * @param url 请求URL
 * @param params 请求参数
 * @returns {*}
 */
const handleUrl = url => params => {
  if (params) {
    let paramsArray = []
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + encodeURIComponent(params[key])))
    if (url.search(/\?/) === -1) {
      typeof (params) === 'object' ? url += '?' + paramsArray.join('&') : url
    } else {
      url += '&' + paramsArray.join('&')
    }
  }
  return url
}

/**
 * fetch 网络请求超时处理
 * @param original_promise 原始的fetch
 * @param timeout 超时时间 30s
 * @returns {Promise.<*>}
 */
const timeoutFetch = (original_fetch, timeout = 30000) => {
  let timeoutBlock = () => {}
  let timeout_promise = new Promise((resolve, reject) => {
    timeoutBlock = () => {
      // 请求超时处理
      reject('timeout promise')
    }
  })

  // Promise.race(iterable)方法返回一个promise
  // 这个promise在iterable中的任意一个promise被解决或拒绝后，立刻以相同的解决值被解决或以相同的拒绝原因被拒绝。
  let abortable_promise = Promise.race([
    original_fetch,
    timeout_promise
  ])

  setTimeout(() => {
      timeoutBlock()
    }, timeout)

  return abortable_promise
}

/**
 * 网络请求工具类
 */
export default class HttpUtils extends Component {

  /**
   * 基于fetch 封装的GET 网络请求
   * @param url 请求URL
   * @param params 请求参数
   * @returns {Promise}
   */
  static getRequest = (url, params = {}) => {
    return timeoutFetch(fetch(handleUrl(url)(params), {
      method: 'GET',
      headers: header
    })).then(response => {
        if (response.ok) {
          return response.json()
        } else {
          alert(response)
        }
      }).then(response => {
        // response.code：是与服务器端约定code：200表示请求成功，非200表示请求失败，message：请求失败内容
        if (response) {
          return response
        } else {
          // 非 200，错误处理
          // alert(response.message)
          return response
        }
      }).catch(error => {
        alert(error)
      })
  }

  /**
   * 基于fetch 的 POST 请求
   * @param url 请求的URL
   * @param params 请求参数
   * @returns {Promise}
   */
  static postRequrst = (url, params = {}) => {
    return timeoutFetch(fetch(url, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(params)
    })).then(response => {
        if (response.ok) {
          return response.json()
        } else {
          alert('服务器繁忙，请稍后再试；\r\nCode:' + response.status)
        }
      }).then(response => {
        // response.code：是与服务器端约定code：200表示请求成功，非200表示请求失败，message：请求失败内容
        if (response && response.code === 200) {
          return response
        } else {
          // alert(response.message)
          return response
        }
      }).catch(error => {
        alert(error)
      })
  }
}
```
**作者的fetch网络请求组件涵盖如下功能：**

* 发送GET网络请求
* 发送POST网络请求
* GET请求数据缓存策略
* 请求超时处理

**fetch网络请求组件待完成事项：**

* 文件、图片网络上传
* 文件下载
* 待补充

# 总结

#### 总之使用fetch发送网络请求还是挺简单的。fetch请求中使用到promise对象和函数柯里化概念。如果同学们对于promise和柯里化不是很熟悉，建议先了解下概念及使用方法。建议同学们直接下载作者的fetch请求组件源码进行调试学习。如果感觉文章对你有帮助，请给个 **`star`** **`关注`** 谢谢。