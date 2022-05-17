import { View, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtForm , AtInput, AtMessage} from 'taro-ui'
import { axios } from 'taro-axios'
import  { useState, useEffect} from 'react'
import { apiDomain } from '../../../config/buildConfig'
import './index.scss'

export default function Index() {
  // Taro.getBackgroundFetchToken({
  //   success: res => {
  //     console.log('🚀 ~ file: index.jsx ~ line 13 ~ Index ~ res', res)
  //   },
  //   fail: res => {
  //     console.log('🚀 ~ file: index.jsx ~ line 16 ~ Index ~ res', res)
  //   },
  // })
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    function changeUserName(val){
      setUsername(val)
    }
    function changePassword(val){
      setPassword(val)
    }
    async function submit(){
      if(username && password){
        console.log(`${apiDomain}/login`)
        const res = await axios.post(`${apiDomain}/login`, {username, password}, {
          withCredentials: false, // 跨域我们暂时 false
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }});
          console.log('🚀 ~ file: index.jsx ~ line 29 ~ submit ~ res', res)
        if(res?.data?.code === 0 && res?.data?.data?.token){
          Taro.atMessage({
            'message': '登陆成功',
            'type': 'success',
          })
          console.log('🚀 ~ file: index.jsx ~ line 38 ~ submit ~ res?.data?.data?.token', res?.data?.data?.token)
          Taro.setBackgroundFetchToken({
            token: res?.data?.data?.token,
          });
          Taro.setStorageSync("username", username);
          Taro.navigateTo({
            url: '/pages/home/index'
          })
        } else if (res?.data?.code === 20103){
            Taro.atMessage({
              'message': res?.data?.msg || '用户不存在',
              'type': 'error',
            })
        } else {
          Taro.atMessage({
            'message': res?.data?.msg || '网络有误，请稍后再试',
              'type': 'error',
          })
        }

      }
    }
    return (
      <View className='index'>
          <AtMessage />
          <Image src='https://16913851.s21i.faiusr.com/4/ABUIABAEGAAgvNDZiwYoyYD_DTDcAzhr.png' style='width:111px;height:27px' />
          <View className='header'>临床皮肤检测系统</View>
          <AtForm
            onSubmit={submit}
          >
          <AtInput
            name='value'
            title='用户名'
            type='text'
            placeholder='请输入用户名'
            value={username}
            onChange={val => changeUserName(val)}
          />
          <AtInput
            name='password'
            title='密码'
            type='password'
            placeholder='请输入密码'
            value={password}
            onChange={val => changePassword(val)}
          />
          <Button className={username && password ? 'submitButton' : 'submitButtonEmpty'} formType='submit'>登录</Button>
        </AtForm>
      </View>
    )

}
