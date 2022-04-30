import { View, Image, Button } from '@tarojs/components'
import { AtForm , AtInput} from 'taro-ui'
import  { useState, useEffect} from 'react'
import './index.scss'

export default function Index() {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    function changeUserName(val){
      setUsername(val)
    }
    function changePassword(val){
      setPassword(val)
    }
    function submit(){
      console.log(username, password)
    }
    return (
      <View className='index'>
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
