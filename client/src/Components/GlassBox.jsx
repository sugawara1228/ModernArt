import React, { useState }from 'react';
import { Flex,} from '@chakra-ui/react';

function GlassBox( props ) {
    const {w, h, justifyContent } = props;
    const style = {
        width: w || '500px',
        height: h || '400px',
        flexDirection: 'column',
        justifyContent: justifyContent || 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        textAlign: 'center',
        backdropFilter: 'blur(30px)',
        paddingTop: '15px',
    }

  return (
        <Flex style={style}> 
        {props.children}
        </Flex>
  );
}

export default GlassBox;
