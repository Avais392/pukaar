import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles, theme } from "../styles";
import { Button, Overlay, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';


export default function Terms(props) {
    return (
        <Overlay isVisible={props.visible} onBackdropPress={() => props.updateVisible()} height="100%" width="100%" overlayStyle={{ padding: 0 }}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]}>
                <ScrollView style={[styles.bodyPadding]}>
                    <Icon name={'close'} color={"white"} type="material-community" size={40} containerStyle={{ alignSelf: "flex-end", top: theme.size(5), right: theme.size(5) }} onPress={() => props.updateVisible()} />
                    <Text style={[styles.bodyText, { textAlign: 'left', color: '#fff' }]}>
                        Terms and Conditions{"\n"}
                        {"\n"}
                        1.	The Terms and Conditions{"\n"}
                        Herein included are the Terms and Conditions (the “Agreement) that control the access and usage of our online platform which will give you access to counseling services ( collectively the “Platform”). The Platform may or may not be provided access through multiple websites or applications whether owned and/or operated by us or by a third party client including ,without limitation, the app Pukaar and its related website.
                        By affirming access or by usage of the Platform, you are entering into this Agreement. It is advised that you read this Agreement prior to your use of the Platform. If you do not agree with any aspects of the Agreement, refrain from using the Platform.
                        When the terms "we", "us", "our" or similar are used in this Agreement, they refer to any company that owns and operates the Platform (the "Company").{"\n"}
                        {"\n"}
                        2.	The Counselors and Counselor Services
                        The Platform may be used to connect you with a Counselor who will provide services to you through the Platform.
                        We require therapists providing Services on the Platform to be an accredited, trained, and experienced licensed psychologist (PhD / PsyD) with recognized professional certification from authorities based on their state and/or jurisdiction. Counselors must have a relevant academic degree in their field, at least 2 years of experience, after successfully completing the necessary education, exams, training and practice requirements as applicable.
                        However we have some counselors, who are not certified psychologists by profession however they have more than 2-3 years of on-ground experience while working with some renowned institution.
                        The Counselors/therapists are independent service providers who are neither our employees nor agents or representatives of the Company. The Platform’s role is limited to enabling the Counselor Services while the Counselor Services themselves are upholding the responsibility of the Counselor who provides them. If you feel the Counselor Services provided by the Counselor do not fit your needs or expectations, you may contact support who will guide you in changing to a different Counselor who provides services through the Platform.
                        While we hope and work to ensure the Counselor Services provided here are beneficial to you, you understand, agree and acknowledge that they may not be the only appropriate solution for everyone’s needs and that they may not be appropriate for every particular situation and/or may not be a complete substitute for a face-to-face examination and/or care in every particular situation.
                        IF YOU ARE THINKING ABOUT SUICIDE OR IF YOU ARE CONSIDERING HARMING YOURSELF OR OTHERS OR IF YOU FEEL THAT ANY OTHER PERSON MAY BE IN ANY DANGER OR IF YOU HAVE ANY MEDICAL EMERGENCY, YOU MUST IMMEDIATELY CALL THE EMERGENCY SERVICE NUMBER (15 IN THE PAKISTAN) AND NOTIFY THE RELEVANT AUTHORITIES. SEEK IMMEDIATE IN PERSON ASSISTANCE. THE PLATFORM IS NOT DESIGNED FOR USE IN ANY OF THE AFOREMENTIONED CASES AND THE COUNSELORS CANNOT PROVIDE THE ASSISTANCE REQUIRED IN ANY OF THE AFOREMENTIONED CASES OR ANY MEDICAL ASSISTANCE.
                        THE PLATFORM IS NOT INTENDED FOR THE PROVISION OF CLINICAL DIAGNOSIS REQUIRING AN IN-PERSON EVALUATION AND YOU SHOULD NOT USE IT IF YOU NEED ANY OFFICIAL DOCUMENTATION OR APPROVALS FOR PURPOSES SUCH AS, BUT NOT LIMITED TO, COURT-ORDERED COUNSELING OR EMOTIONAL SERVICE. IT IS ALSO NOT INTENDED FOR ANY INFORMATION REGARDING WHICH DRUGS OR MEDICAL TREATMENT MAY BE APPROPRIATE FOR YOU, AND YOU SHOULD DISREGARD ANY SUCH ADVICE IF DELIVERED THROUGH THE PLATFORM.
                        DO NOT DISREGARD, AVOID, OR DELAY IN OBTAINING IN-PERSON CARE FROM YOUR DOCTOR OR OTHER QUALIFIED PROFESSIONAL BECAUSE OF INFORMATION OR ADVICE YOU RECEIVED THROUGH THE PLATFORM.{"\n"}
                        {"\n"}
                        3.	Privacy and Security
                        Protecting and safeguarding any information you provide through the Platform is extremely important to us. Information about our security and privacy practices can be found on our Privacy Policy.
                        BY AGREEING TO THIS AGREEMENT AND/OR BY USING THE PLATFORM, YOU ARE ALSO AGREEING TO THE TERMS OF THE PRIVACY POLICY. THE PRIVACY POLICY IS INCORPORATED INTO AND DEEMED A PART OF THIS AGREEMENT. THE SAME RULES THAT APPLY REGARDING CHANGES AND REVISIONS OF THIS AGREEMENT ALSO APPLY TO CHANGES AND REVISIONS OF THE PRIVACY POLICY.{"\n"}
                        {"\n"}
                        4.	Third Party Content
                        The Platform may contain other content, products or services which are offered or provided by third parties ("Third Party Content"), links to Third Party Content (including but not limited to links to other websites) or advertisements which are related to Third Party Content. We have no responsibility for the creation of any such Third Party Content, including (but not limited to) any related products, practices, terms or policies, and we will not be liable for any damage or loss caused by any Third Party Content.{"\n"}
                        {"\n"}
                        5.	Disclaimer of Warranty and Limitation of Liability
                        YOU HEREBY RELEASE US AND AGREE TO HOLD US HARMLESS FROM ANY AND ALL CAUSES OF ACTION AND CLAIMS OF ANY NATURE RESULTING FROM THE COUNSELOR SERVICES OR THE PLATFORM, INCLUDING (WITHOUT LIMITATION) ANY ACT, OMISSION, OPINION, RESPONSE, ADVICE, SUGGESTION, INFORMATION AND/OR SERVICE OF ANY COUNSELOR AND/OR ANY OTHER CONTENT OR INFORMATION ACCESSIBLE THROUGH THE PLATFORM.
                        YOU UNDERSTAND, AGREE AND ACKNOWLEDGE THAT THE PLATFORM IS PROVIDED "AS IS" WITHOUT ANY EXPRESS OR IMPLIED WARRANTIES OF ANY KIND, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, NON-INFRINGEMENT, SECURITY, FITNESS FOR A PARTICULAR PURPOSE OR ACCURACY. THE USE OF THE PLATFORM IS AT YOUR OWN RISK. TO THE FULLEST EXTENT OF THE LAW, WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESSED OR IMPLIED.
                        YOU UNDERSTAND, AGREE AND ACKNOWLEDGE THAT WE SHALL NOT BE LIABLE TO YOU OR TO ANY THIRD PARTY FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE OR EXEMPLARY DAMAGES.
                        If the applicable law does not allow the limitation of liability as set forth above, the limitation will be deemed modified solely to the extent necessary to comply with applicable law.
                        This section (limitation of liability) shall survive the termination or expiration of this Agreement.{"\n"}
                        {"\n"}
                        </Text>
                        <Text style={[styles.bodyText, { textAlign: 'left', color: '#fff' }]}>
                        6.	Your account, representations, conduct and commitments
                        You hereby confirm that you are at least 16 years old of age. Or if 13 years or less, you have the right to use internet from your legal guardian.
                        You hereby confirm that you are legally able to enter into a contract.
                        You hereby confirm and agree that all the information that you provided in or through the Platform, and the information that you will provide in or through the Platform in the future, is accurate, true, current and complete. Furthermore, you agree that during the term of this Agreement you will make sure to maintain and update this information so it will continue to be accurate, current and complete.
                        You agree, confirm and acknowledge that you are responsible for maintaining the confidentiality of your password and any other security information related to your account (collectively "Account Access"). We advise you to change your password frequently and to take extra care in safeguarding your password and other sensitive information.
                        You agree to notify us immediately of any unauthorized use of your Account Access or any other concern for breach of your account security.
                        You agree, confirm and acknowledge that we will not be liable for any loss or damage that is incurred as a result of someone else using your account, either with or without your consent and/or knowledge.
                        You agree, confirm and acknowledge that you are solely and fully liable and responsible for all activities performed using your Account Access. You further acknowledge and agree that we will hold you liable and responsible for any damage or loss incurred as a result of the use of your Account Access by any person whether authorized by you or not, and you agree to indemnify us for any such damage or loss.
                        You agree and commit not to use the account or Account Access of any other person for any reason.
                        You agree and confirm that your use of the Platform, including the Counselor Services, are for your own personal use only and that you are not using the Platform or the Counselor Services for or behalf of any other person or organization.
                        You agree and commit not to interfere with or disrupt, or attempt to interfere with or disrupt, any of our systems, services, servers, networks or infrastructure, or any of the Platform's systems, services, servers, networks or infrastructure, including without limitation obtaining unauthorized access to the aforementioned.
                        You agree and commit not to make any use of the Platform for the posting, sending or delivering of either of the following: (a) unsolicited email and/or advertisement or promotion of goods and services; (b) malicious software or code; (c) unlawful, harassing, privacy invading, abusive, threatening, vulgar, obscene, racist or potentially harmful content; (d) any content that infringes a third party right including intellectual property rights; (e) any content that may cause damage to a third party; (f) any content which may constitute, cause or encourage a criminal action or violate any applicable law.
                        You agree and commit not to violate any applicable local, state, national or international law, statute, ordinance, rule, regulation or ethical code in relation to your use of the Platform and your relationship with the Counselors and us.
                        If you receive any file from us or from a Counselor, whether through the Platform or not, you agree to check and scan this file for any virus or malicious software prior to opening or using this file.
                        You will indemnify us, defend us, and hold us harmless from and against any and all claims, losses, causes of action, demands, liabilities, costs or expenses (including, but not limited to, litigation and reasonable attorneys' fees and expenses) arising out of or relating to any of the following: (a) your access to or use of the Platform; (b) any actions made with your account or Account Access whether by you or by someone else; (c) your violation of any of the provisions of this Agreement; (d) non-payment for any of the services (including Counselor Services) which were provided through the Platform; (e) your violation of any third party right, including, without limitation, any intellectual property right, publicity, confidentiality, property or privacy right. This clause shall survive expiration or termination of this Agreement.
                        You confirm and agree to use only credit cards or other payment means (collectively “Payment Means”) which you are duly and fully authorized to use, and that all payment related information that you provided and will provide in the future, to or through the Platform, is accurate, current and correct and will continue to be accurate, current and correct.
                        You agree to pay all fees and charges associated with your Account on a timely basis and according to the fees schedule, the terms and the rates as published in the Platform. By providing us with your Payment Means you authorize us to bill and charge you through that Payment Means and you agree to maintain valid Payment Means information in your Account information.
                        If you have any concerns about a bill or a payment, please contact us immediately by sending an email to pukaarcommunity@gmail.com. We will evaluate your issue on a case by case basis and, at our discretion, take steps to resolve any issue, including but not limited to helping you find a new Counselor, extending your subscription at no cost to you, and issuing partial or full refunds when applicable.{"\n"}
                        {"\n"}
                        7.	Modifications, Termination, Interruption and Disruptions to the Platform
                        You understand, agree and acknowledge that we may modify, suspend, disrupt or discontinue the Platform, any part of the Platform or the use of the Platform, whether to all clients or to you specifically, at any time with or without notice to you. You agree and acknowledge that we will not be liable for any of the aforementioned actions or for any losses or damages that are caused by any of the aforementioned actions.
                        The Platform depends on various factors such as software, hardware and tools, either our own or those owned and/or operated by our contractors and suppliers. While we make commercially reasonable efforts to ensure the Platform’s reliability and accessibility, you understand and agree that no platform can be 100% reliable and accessible and so we cannot guarantee that access to the Platform will be uninterrupted or that it will be accessible, consistent, timely or error-free at all times.{"\n"}
                        {"\n"}
                        8.	Notices
                        We may provide notices or other communications to you regarding this agreement or any aspect of the Platform, by email to the email address that we have on record, by regular mail or by posting it online. The date of receipt shall be deemed the date on which such notice is given. Notices sent to us must be delivered by email to pukaarcommunity@gmail.com.{"\n"}
                        {"\n"}
                        9.	Important notes about our Agreement
                        This Agreement and our relationship with you shall both be interpreted solely in accordance with the laws of the State of Pakistan excluding any rules governing choice of laws.
                        You irrevocably agree that the exclusive venue for any action or proceeding arising out of relating to this Agreement or our relationship with you, regardless of theory, shall be with Government of Pakistan. You irrevocably consent to the personal jurisdiction of the aforementioned courts and hereby waive any objection to the exercise of jurisdiction by the aforementioned courts.
                        THIS AGREEMENT CONSTITUTES THE ENTIRE AGREEMENT BETWEEN YOU AND US. YOU CONFIRM THAT YOU HAVE NOT RELIED UPON ANY PROMISES OR REPRESENTATIONS BY US EXCEPT AS SET FORTH IN THIS AGREEMENT.
                        We may change this Agreement by posting modifications on the Platform. Unless otherwise specified by us, all modifications shall be effective upon posting. Therefore, you are encouraged to check the terms of this Agreement frequently. The last update date of this Agreement is posted at the bottom of the Agreement. By using the Platform after the changes become effective, you agree to be bound by such changes to the Agreement. If you do not agree to the changes, you must terminate access to the Platform and participation in its services.
                        We may freely transfer or assign this Agreement or any of its obligations hereunder.
                        The paragraph headings in this Agreement are solely for the sake of convenience and will not be applied in the interpretation of this Agreement.
                        If any provision of this Agreement is held by a court of competent jurisdiction to be illegal, invalid, unenforceable, or otherwise contrary to law, the remaining provisions of this Agreement will remain in full force and effect.
                        To clear any doubt, all clauses regarding limitations of liabilities and indemnification shall survive the termination or expiration of this Agreement.
                        {"\n"}{"\n"}
                        Last Updated: November- 2018
                        {"\n"}
                </Text>
                </ScrollView>
            </LinearGradient>
        </Overlay>
    )
}