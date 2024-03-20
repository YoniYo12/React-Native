import { FlatList, StyleSheet, Text,Button, Modal, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import RenderCampsite from '../features/campsites/RenderCampsite';
import { toggleFavorite } from '../features/favorites/favoritesSlice';
import { useState } from 'react';
import { Rating,Input,Icon } from 'react-native-elements';
import { postComment } from '../features/comments/commentsSlice';


const CampsiteInfoScreen = ({ route }) => {
    const { campsite } = route.params;
    const comments = useSelector((state) => state.comments);
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch();

    const [showModal,setShowModal] = useState(false)
    const onShowModal = ()=>{
        setShowModal(!showModal)
    }

    const [rating,setRating] = useState(5)
    const [author,setAuthor]= useState('')
    const [text,setText]= useState('')
    
    const handleSubmit = ()=>{
        const newComment = {
            author,
            rating,
            text,
            campsiteId: campsite.id
        };
        dispatch(postComment(newComment));
    }

    const resetForm= ()=>{
        setRating(5);
        setAuthor('');
        setText('');
    }

    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Rating style={{alignItems:'flex-start',paddingVertical:'5%'}}
                startingValue={item.rating}
                imageSize={10}
                readonly
                >{item.rating} Stars
                </Rating>
                <Text style={{ fontSize: 12 }}>
                    {`-- ${item.author}, ${item.date}`}
                </Text>
            </View>
            
        );
    };

    return (
        <>
            <FlatList
                data={comments.commentsArray.filter(
                    (comment) => comment.campsiteId === campsite.id
                )}
                renderItem={renderCommentItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    marginHorizontal: 20,
                    paddingVertical: 20
                }}
                ListHeaderComponent={
                    <>
                        <RenderCampsite
                            campsite={campsite}
                            isFavorite={favorites.includes(campsite.id)}
                            markFavorite={() => dispatch(toggleFavorite(campsite.id))}
                            onShowModal={onShowModal}
                        />
                        <Text style={styles.commentsTitle}>Comments</Text>
                    </>
                }
            />
            <Modal
                animationType='slide'
                transparent={false}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modal}>
                    
                    <Rating
                        showRating
                        startingValue={rating}
                        imageSize={40}
                        onFinishRating={(rating) => setRating(rating)}
                        style={{ paddingVertical: 40 }}
                    />
                    
                    
                    <Input
                        placeholder='Author'
                        leftIcon={<Icon name='user-o' type='font-awesome' />}
                        leftIconContainerStyle={{ paddingRight: 10 }}
                        onChangeText={(author) => setAuthor(author)}
                        value={author}
                    />
                    
                    <Input
                        placeholder='Comment'
                        leftIcon={<Icon name='comment-o' type='font-awesome' />}
                        leftIconContainerStyle={{ paddingRight: 10 }}
                        onChangeText={(text) => setText(text)}
                        value={text}
                    />
                   
                    <View >
                        
                        <Button 
                            title='Submit'
                            // color='#5637DD'
                            style={styles.button}

                            onPress={() => {
                                handleSubmit();
                                resetForm();
                                setShowModal(false);
                            }}
                        />
                        
                        <Button 
                            title='Cancel'
                            color='#808080'
                            onPress={() => {
                                setShowModal(false);
                                resetForm();
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </>
        
    );
};

const styles = StyleSheet.create({
    commentsTitle: {
        textAlign: 'center',
        backgroundColor: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#43484D',
        padding: 10,
        paddingTop: 30
    },
    commentItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    modal:{
        justifyContent:'center',
        margin: 20, 
    },
    button:{
        justifyContent:'center',
        backgroundColor:'black',
        margin: 20,
    }
    
});

export default CampsiteInfoScreen;