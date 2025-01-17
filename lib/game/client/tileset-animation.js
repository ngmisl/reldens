/**
 *
 * Reldens - TilesetAnimation
 *
 */

class TileSetAnimation
{

    register(layer, tileset)
    {
        this.animations = [];
        this.registered = {};
        this.layer = layer;
        this.tileset = tileset;
        for(let i of Object.keys(tileset.tileData)){
            let tileData = tileset.tileData[i];
            tileData.id = i;
            let indexCounter = 0;
            for(let anInd of tileData.animation){
                if(Number(i) === Number(anInd?.tileid || 0)){
                    tileData.initIndex = indexCounter;
                    break;
                }
                indexCounter++;
            }
            this.animations.push(tileData);
        }
    }

    start()
    {
        for(let anim of this.animations){
            let animation = anim.animation;
            let total = animation.length;
            let startIndex = Number(anim.initIndex || 0);
            let next = Number((startIndex+1) % total);
            this.repeat(anim, startIndex, next);
        }
    }

    repeat(anim, index, next)
    {
        let id = anim.id;
        if(this.registered[id]){
            this.registered[id] = null;
        }
        let animation = anim.animation;
        let total = animation.length;
        let firstId = Number(this.tileset.firstgid);
        let replaceTile = Number(anim.animation[index].tileid)+firstId;
        let replacementTile = Number(anim.animation[next].tileid)+firstId;
        this.layer.replaceByIndex(replaceTile, replacementTile);
        let duration = animation[next].duration;
        let indexTotal = Number((next+1) % total);
        this.registered[id] = setTimeout(this.repeat.bind(this, anim, Number(next), indexTotal), duration);
    }

    destroy()
    {
        for(let i of Object.keys(this.registered)){
            if(this.registered[i]){
                clearTimeout(this.registered[i]);
            }
        }
    }

}

module.exports.TileSetAnimation = TileSetAnimation;
