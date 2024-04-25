import React from 'react';
import { Html, Head, Font, Preview, Section, Row, Heading, Text } from '@react-email/components'; 


interface VerificationEmailProps {
    username: string;
    otp: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({ username, otp }: VerificationEmailProps) => {
    return (
        <Html lang='en' dir='ltr'>
            <Head>
                <title>Verification Code</title>
                <Font  fontFamily='Roboto' fallbackFontFamily={'Arial'} />
            </Head>
            <body>
                <Preview>Here s Your verification code: {otp}</Preview>
                <Section>
                    <Row>
                        <Heading as='h2'>Hello {username}</Heading>
                        <Text>
                            Your verification code is {otp}. Please enter this code to verify your account.
                        </Text>
                        <Row>
                            <Text>{otp}</Text>
                        </Row>
                        <Text>
                            If you didnt request this code, you can safely ignore this email.
                        </Text>
                    </Row>
                </Section>
            </body>
        </Html>
    );
};

export default VerificationEmail;
