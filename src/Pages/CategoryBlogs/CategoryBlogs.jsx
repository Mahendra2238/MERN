import Banner from "../../Components/Banner/Banner";
import TrendingBlog from "../../Components/TrendingBlog/TrendingBlog";
import blogs from "../../Utils/MockData";
import './CategoryBlogs.css';
import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";

const categoryBannerImages = {
    Programming: 'programming-blog-cover.jpg',
    Cooking: 'cooking-blog-cover.jpg',
    Workouts: 'Workouts-blog-cover.jpg',
    Health: 'Halth-blogs-cover.png',
    Travelling: 'travelling-blog-cover.jpg'
};

function CategoryBlogs() {
    const [currentCategory, setCurrentCategory] = useState('Programming')
    const { category } = useParams();
    console.log('Line 11: ', category)
    useEffect(()=>{
        if(category)
            {
                setCurrentCategory(category)
            }
    },[])
    return (
        <>
            <Banner image={categoryBannerImages[currentCategory] || 'Banner.jpg'} />
                <div className="trending-blogs-section">
                  <h1>
                    {currentCategory}
                  </h1>
                  <div className="all-trending-blogs d-flex flex-wrap row-gap-2 justify-content-start">
                    {
                      blogs.map(blog => blog.category == currentCategory &&
                        <TrendingBlog blog={blog} />
                      )
                    }
                  </div>
                </div>
            <br />
            <br />
            <br />
        </>
    )
}
export default CategoryBlogs;
