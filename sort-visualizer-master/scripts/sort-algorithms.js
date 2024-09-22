"use strict";
class sortAlgorithms {
    constructor(time) {
        this.list = document.querySelectorAll(".cell");
        this.size = this.list.length;
        this.time = time;
        this.help = new Helper(this.time, this.list);
    }

    // BUBBLE SORT
    BubbleSort = async () => {
        for(let i = 0 ; i < this.size - 1 ; ++i) {
            for(let j = 0 ; j < this.size - i - 1 ; ++j) {
                await this.help.mark(j);
                await this.help.mark(j+1);
                if(await this.help.compare(j, j+1)) {
                    await this.help.swap(j, j+1);
                }
                await this.help.unmark(j);
                await this.help.unmark(j+1);
            }
            this.list[this.size - i - 1].setAttribute("class", "cell done");
        }
        this.list[0].setAttribute("class", "cell done");
    }

    // INSERTION SORT
    InsertionSort = async () => {
        for(let i = 0 ; i < this.size - 1 ; ++i) {
            let j = i;
            while(j >= 0 && await this.help.compare(j, j+1)) {
                await this.help.mark(j);
                await this.help.mark(j+1);
                await this.help.pause();
                await this.help.swap(j, j+1);
                await this.help.unmark(j);
                await this.help.unmark(j+1);
                j -= 1;
            }
        }
        for(let counter = 0 ; counter < this.size ; ++counter) {
            this.list[counter].setAttribute("class", "cell done");
        }
    }

    // SELECTION SORT
    SelectionSort = async () => {
        for(let i = 0 ; i < this.size ; ++i) {
            let minIndex = i;
            for(let j = i ; j < this.size ; ++j) {
                await this.help.markSpl(minIndex);
                await this.help.mark(j);
                if(await this.help.compare(minIndex, j)) {
                    await this.help.unmark(minIndex);
                    minIndex = j;
                }
                await this.help.unmark(j);
                await this.help.markSpl(minIndex);
            }
            await this.help.mark(minIndex);
            await this.help.mark(i);
            await this.help.pause();
            await this.help.swap(minIndex, i);
            await this.help.unmark(minIndex);
            this.list[i].setAttribute("class", "cell done");
        }
    }

    // MERGE SORT
    MergeSort = async () => {
        await this.MergeDivider(0, this.size - 1);
        for(let counter = 0 ; counter < this.size ; ++counter) {
            this.list[counter].setAttribute("class", "cell done");
        }
    }

    MergeDivider = async (start, end) => {
        if(start < end) {
            let mid = start + Math.floor((end - start)/2);
            await this.MergeDivider(start, mid);
            await this.MergeDivider(mid+1, end);
            await this.Merge(start, mid, end);
        }
    }

    Merge = async (start, mid, end) => {
        let newList = new Array();
        let frontcounter = start;
        let midcounter = mid + 1;
        
        while(frontcounter <= mid && midcounter <= end) {
            let fvalue = Number(this.list[frontcounter].getAttribute("value"));
            let svalue = Number(this.list[midcounter].getAttribute("value"));
            if(fvalue >= svalue) {
                newList.push(svalue);
                ++midcounter;
            }
            else {
                newList.push(fvalue);
                ++frontcounter;
            }
        }
        while(frontcounter <= mid) {
            newList.push(Number(this.list[frontcounter].getAttribute("value")));
            ++frontcounter;
        }
        while(midcounter <= end) {
            newList.push(Number(this.list[midcounter].getAttribute("value")));
            ++midcounter;
        }

        for(let c = start ; c <= end ; ++c) {
            this.list[c].setAttribute("class", "cell current");
        }
        for(let c = start, point = 0 ; c <= end && point < newList.length; 
            ++c, ++point) {
                await this.help.pause();
                this.list[c].setAttribute("value", newList[point]);
                this.list[c].style.height = `${3.5*newList[point]}px`;
        }
        for(let c = start ; c <= end ; ++c) {
            this.list[c].setAttribute("class", "cell");
        }
    }

    // QUICK SORT
    QuickSort = async () => {
        await this.QuickDivider(0, this.size-1);
        for(let c = 0 ; c < this.size ; ++c) {
            this.list[c].setAttribute("class", "cell done");
        }
    }

    QuickDivider = async (start, end) => {
        if(start < end) {
            let pivot = await this.Partition(start, end);
            await this.QuickDivider(start, pivot-1);
            await this.QuickDivider(pivot+1, end);
        }
    }

    Partition = async (start, end) => {
        let pivot = this.list[end].getAttribute("value");
        let prev_index = start - 1;

        await this.help.markSpl(end);
        for(let c = start ; c < end ; ++c) {
            let currValue = Number(this.list[c].getAttribute("value"));
            await this.help.mark(c);
            if(currValue < pivot) {
                prev_index += 1;
                await this.help.mark(prev_index);
                await this.help.swap(c, prev_index);
                await this.help.unmark(prev_index);
            }
            await this.help.unmark(c);
        }
        await this.help.swap(prev_index+1, end);
        await this.help.unmark(end);
        return prev_index + 1;
    }
    RadixSort = async () => {
        let maxNum = Math.max(...this.list.map(cell => parseInt(cell.textContent)));
        let exp = 1;
        
        while (Math.floor(maxNum / exp) > 0) {
            await this.countingSortForRadix(exp);
            exp *= 10;
        }
    
        for (let i = 0; i < this.size; i++) {
            this.list[i].setAttribute("class", "cell done");
        }
    }
    
    countingSortForRadix = async (exp) => {
        let output = new Array(this.size).fill(0);
        let count = new Array(10).fill(0);
    
        for (let i = 0; i < this.size; i++) {
            let val = parseInt(this.list[i].textContent);
            let index = Math.floor(val / exp) % 10;
            await this.help.mark(i);
            count[index]++;
            await this.help.unmark(i);
        }
    
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
    
        for (let i = this.size - 1; i >= 0; i--) {
            let val = parseInt(this.list[i].textContent);
            let index = Math.floor(val / exp) % 10;
            output[--count[index]] = this.list[i];
        }
    
        for (let i = 0; i < this.size; i++) {
            await this.help.pause();
            await this.help.swap(this.list[i], output[i]);
        }
    }
    CountingSort = async () => {
        let max = Math.max(...this.list.map(cell => parseInt(cell.textContent)));
        let min = Math.min(...this.list.map(cell => parseInt(cell.textContent)));
        let range = max - min + 1;
    
        let count = new Array(range).fill(0);
        let output = new Array(this.size).fill(0);
    
        for (let i = 0; i < this.size; i++) {
            let val = parseInt(this.list[i].textContent);
            await this.help.mark(i);
            count[val - min]++;
            await this.help.unmark(i);
        }
    
        for (let i = 1; i < range; i++) {
            count[i] += count[i - 1];
        }
    
        for (let i = this.size - 1; i >= 0; i--) {
            let val = parseInt(this.list[i].textContent);
            output[--count[val - min]] = this.list[i];
        }
    
        for (let i = 0; i < this.size; i++) {
            await this.help.pause();
            await this.help.swap(this.list[i], output[i]);
            this.list[i].setAttribute("class", "cell done");
        }
    }
    BucketSort = async () => {
        let bucketSize = 5; // Adjustable size
        let min = Math.min(...this.list.map(cell => parseInt(cell.textContent)));
        let max = Math.max(...this.list.map(cell => parseInt(cell.textContent)));
    
        let bucketCount = Math.floor((max - min) / bucketSize) + 1;
        let buckets = new Array(bucketCount).fill(null).map(() => []);
    
        for (let i = 0; i < this.size; i++) {
            let val = parseInt(this.list[i].textContent);
            let bucketIndex = Math.floor((val - min) / bucketSize);
            await this.help.mark(i);
            buckets[bucketIndex].push(this.list[i]);
            await this.help.unmark(i);
        }
    
        for (let i = 0; i < buckets.length; i++) {
            if (buckets[i].length > 0) {
                await this.insertionSort(buckets[i]);
                for (let j = 0; j < buckets[i].length; j++) {
                    await this.help.pause();
                    await this.help.swap(this.list[i + j], buckets[i][j]);
                    this.list[i + j].setAttribute("class", "cell done");
                }
            }
        }
    }
    
    insertionSort = async (bucket) => {
        for (let i = 1; i < bucket.length; i++) {
            let key = bucket[i];
            let j = i - 1;
            while (j >= 0 && parseInt(bucket[j].textContent) > parseInt(key.textContent)) {
                bucket[j + 1] = bucket[j];
                j--;
            }
            bucket[j + 1] = key;
        }
    }
        
    
    
};