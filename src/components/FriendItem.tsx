// @ts-ignore
import React from 'react';
// @ts-ignore
import styles from './/src/components/FriendItem.module.css';

interface FriendItemProps {
    imgSrc?: string
}

function FriendItem({name, img, imgSrc}) {
    return (
        <div className={styles.friendItem}>
            <div className={styles.imgWrapper}>
                <img src={img} alt="icon"/>
            </div>
            <p>{name}</p>
            <i className="fa fa-xmark"></i>
        </div>
    );
}

export default FriendItem;