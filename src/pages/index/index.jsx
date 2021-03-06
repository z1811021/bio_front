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
  //     console.log('π ~ file: index.jsx ~ line 13 ~ Index ~ res', res)
  //   },
  //   fail: res => {
  //     console.log('π ~ file: index.jsx ~ line 16 ~ Index ~ res', res)
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
          withCredentials: false, // θ·¨εζδ»¬ζζΆ false
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }});
          console.log('π ~ file: index.jsx ~ line 29 ~ submit ~ res', res)
        if(res?.data?.code === 0 && res?.data?.data?.token){
          Taro.atMessage({
            'message': 'η»ιζε',
            'type': 'success',
          })
          console.log('π ~ file: index.jsx ~ line 38 ~ submit ~ res?.data?.data?.token', res?.data?.data?.token)
          Taro.setBackgroundFetchToken({
            token: res?.data?.data?.token,
          });
          Taro.setStorageSync("username", username);
          Taro.navigateTo({
            url: '/pages/home/index'
          })
        } else if (res?.data?.code === 20103){
            Taro.atMessage({
              'message': res?.data?.msg || 'η¨ζ·δΈε­ε¨',
              'type': 'error',
            })
        } else {
          Taro.atMessage({
            'message': res?.data?.msg || 'η½η»ζθ――οΌθ―·η¨εεθ―',
              'type': 'error',
          })
        }

      }
    }
    return (
      <View className='index'>
          <AtMessage />
          <Image src='https://16913851.s21i.faiusr.com/4/ABUIABAEGAAgvNDZiwYoyYD_DTDcAzhr.png' style='width:111px;height:27px' />
          <View className='header'>δΈ΄εΊη?θ€ζ£ζ΅η³»η»</View>
          <AtForm
            onSubmit={submit}
          >
          <AtInput
            name='value'
            title='η¨ζ·ε'
            type='text'
            placeholder='θ―·θΎε₯η¨ζ·ε'
            value={username}
            onChange={val => changeUserName(val)}
          />
          <AtInput
            name='password'
            title='ε―η '
            type='password'
            placeholder='θ―·θΎε₯ε―η '
            value={password}
            onChange={val => changePassword(val)}
          />
          <Button className={username && password ? 'submitButton' : 'submitButtonEmpty'} formType='submit'>η»ε½</Button>
        </AtForm>
      </View>
    )

}
