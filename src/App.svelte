<script>
    import { onMount } from 'svelte'
    import _ from 'lodash'
    const baseURL = `https://hacker-news.firebaseio.com/v0/`
    let ids = []
    let stories = []

    async function getIds() {
        try {
            const response = await fetch(`${baseURL}/topstories.json?print=pretty`)
            let fullData = await response.json()
            ids = fullData
            ids.length = 30
            return ids
        } catch (error) {
            console.log(error, 'There was a problem')
        }
    }

    async function getStories(ids) {
        const mapStory = _.map(ids, async (id) => {
            const response = await fetch(`${baseURL}/item/${id}.json?print=pretty`)
            const result = await response.json()

            const url = result.url ? result.url : '-'
            const formattedData = {
                title: result.title,
                score: result.score,
                url,
            }
            return formattedData
        })
        return mapStory
    }

    const storyResponse = async (array) => {
        let topStories = await getStories(array)
        await Promise.all(topStories).then((values) => {
            stories = values
        })
    }

    onMount(async () => {
        const res = await getIds()
        ids = await res
        await storyResponse(ids)
    })

    function formatLink(link) {
        if (link === undefined) {
            return (link = ' ')
        } else {
            return link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
        }
    }
</script>

<main>
    <header>
        <h3>Hacker News</h3>
    </header>

    {#each stories as story, i}
        <div class="story">
            <div class="rank">{i + 1}</div>
            <div class="storyInfo">
                <div>
                    <a class="storyTitle" href={story.url} target="_blank">{story.title}</a>
                    <a class="storyUrl" href={story.url} target="_blank">{formatLink(story.url)}</a>
                </div>
                <div class="storyPoints">{story.score}</div>
            </div>
        </div>
    {/each}

</main>

<style>
    main {
        /* text-align: center; */
        padding: 1em;
        width: 720px;
        margin: 0 auto;
    }


    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
