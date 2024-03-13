import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { VStack } from '@chakra-ui/layout';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/toast';
import { useState } from 'react';
import { Button } from '@chakra-ui/button';
import axios from '../../api/axios';
import { ChatState } from '../../Context/ChatProvider';

const Login = () => {
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState();
  const [password, setpassword] = useState();
  const [loading, setLoading] = useState(false);
  const { setAuth } = ChatState();

  const handleClick = () => setShow(!show);
  const toast = useToast();
  const navigate = useNavigate();

  const submitHandel = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please Fill all the Feilds',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        '/api/v1/user/login',
        {
          email,
          password,
        },
        config,
      );

      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

      localStorage.setItem(
        'Info',
        JSON.stringify({
          name: data?.name,
          _id: data?._id,
          email: data?.email,
          pic: data?.pic,
        }),
      );
      setAuth(data);
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response?.data?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="email" color="black" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          _focus={{ boxShadow: '0' }}
          value={email}
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Enter your password"
            onChange={(e) => setpassword(e.target.value)}
            value={password}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'hide' : 'show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        bg="#1A202C"
        _hover={{ backgroundColor: '#F7FAFC', color: '#1A202C' }}
        color="#F7FAFC"
        m={3}
        width="100%"
        onClick={submitHandel}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        bg="#1A202C"
        _hover={{ backgroundColor: '#F7FAFC', color: '#1A202C' }}
        color="#F7FAFC"
        width="100%"
        onClick={() => {
          setEmail('guest@lorem.com');
          setpassword('1234');
        }}
        isLoading={loading}
      >
        Login as Guest
      </Button>
    </VStack>
  );
};

export default Login;
