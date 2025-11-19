import { expect } from 'chai';
import { ResourceProperty } from '../src/model/ResourceProperty.js';
import { Config } from '../src/model/Config.js';

// Concrete test class to test the abstract ResourceProperty
class TestResourceProperty extends ResourceProperty<{ properties?: { [key: string]: string } }> {
    protected getConfig(): Config {
        return {};
    }
}

describe('ResourceProperty', () => {
    
    describe('getProperties', () => {
        it('should return empty object when properties is null', () => {
            const resource = new TestResourceProperty({});
            expect(resource.getProperties()).to.deep.equal({});
        });

        it('should return copy of properties', () => {
            const resource = new TestResourceProperty({ properties: { key1: 'value1', key2: 'value2' } });
            const props = resource.getProperties();
            expect(props).to.deep.equal({ key1: 'value1', key2: 'value2' });
            
            // Verify it's a copy, not a reference
            props.key3 = 'value3';
            expect(resource.getProperties()).to.deep.equal({ key1: 'value1', key2: 'value2' });
        });
    });

    describe('setProperties', () => {
        it('should set properties and return this for chaining', () => {
            const resource = new TestResourceProperty({});
            const result = resource.setProperties({ key1: 'value1', key2: 'value2' });
            
            expect(result).to.equal(resource);
            expect(resource.getProperties()).to.deep.equal({ key1: 'value1', key2: 'value2' });
        });

        it('should create a copy of the input properties', () => {
            const resource = new TestResourceProperty({});
            const input: { [key: string]: string } = { key1: 'value1' };
            resource.setProperties(input);
            
            input.key2 = 'value2';
            expect(resource.getProperties()).to.deep.equal({ key1: 'value1' });
        });

        it('should replace existing properties', () => {
            const resource = new TestResourceProperty({ properties: { old: 'value' } });
            resource.setProperties({ new: 'value' });
            
            expect(resource.getProperties()).to.deep.equal({ new: 'value' });
        });
    });

    describe('getProperty', () => {
        it('should return undefined when property does not exist', () => {
            const resource = new TestResourceProperty({});
            expect(resource.getProperty('missing')).to.be.undefined;
        });

        it('should return property value when it exists', () => {
            const resource = new TestResourceProperty({ properties: { key1: 'value1' } });
            expect(resource.getProperty('key1')).to.equal('value1');
        });

        it('should return undefined for empty string values', () => {
            const resource = new TestResourceProperty({ properties: { key1: '' } });
            expect(resource.getProperty('key1')).to.be.undefined;
        });

        it('should return undefined for whitespace-only values', () => {
            const resource = new TestResourceProperty({ properties: { key1: '   ' } });
            expect(resource.getProperty('key1')).to.be.undefined;
        });

        it('should support multiple fallback keys', () => {
            const resource = new TestResourceProperty({ properties: { key2: 'value2' } });
            expect(resource.getProperty('key1', 'key2', 'key3')).to.equal('value2');
        });

        it('should return first non-empty property when multiple keys provided', () => {
            const resource = new TestResourceProperty({ 
                properties: { key1: '', key2: 'value2', key3: 'value3' } 
            });
            expect(resource.getProperty('key1', 'key2', 'key3')).to.equal('value2');
        });
    });

    describe('setProperty', () => {
        it('should set property and return this for chaining', () => {
            const resource = new TestResourceProperty({});
            const result = resource.setProperty('key1', 'value1');
            
            expect(result).to.equal(resource);
            expect(resource.getProperty('key1')).to.equal('value1');
        });

        it('should initialize properties object if null', () => {
            const resource = new TestResourceProperty({});
            resource.setProperty('key1', 'value1');
            
            expect(resource.getProperties()).to.deep.equal({ key1: 'value1' });
        });

        it('should convert null value to empty string', () => {
            const resource = new TestResourceProperty({});
            resource.setProperty('key1', null);
            
            expect(resource.payload.properties?.key1).to.equal('');
        });

        it('should convert undefined value to empty string', () => {
            const resource = new TestResourceProperty({});
            resource.setProperty('key1', undefined);
            
            expect(resource.payload.properties?.key1).to.equal('');
        });

        it('should do nothing when key is null', () => {
            const resource = new TestResourceProperty({});
            resource.setProperty(null as any, 'value1');
            
            expect(resource.getProperties()).to.deep.equal({});
        });

        it('should do nothing when key is empty string', () => {
            const resource = new TestResourceProperty({});
            resource.setProperty('', 'value1');
            
            expect(resource.getProperties()).to.deep.equal({});
        });

        it('should do nothing when key is whitespace only', () => {
            const resource = new TestResourceProperty({});
            resource.setProperty('   ', 'value1');
            
            expect(resource.getProperties()).to.deep.equal({});
        });

        it('should update existing property', () => {
            const resource = new TestResourceProperty({ properties: { key1: 'old' } });
            resource.setProperty('key1', 'new');
            
            expect(resource.getProperty('key1')).to.equal('new');
        });
    });

    describe('deleteProperty', () => {
        it('should delete property by setting it to empty string', () => {
            const resource = new TestResourceProperty({ properties: { key1: 'value1' } });
            const result = resource.deleteProperty('key1');
            
            expect(result).to.equal(resource);
            expect(resource.payload.properties?.key1).to.equal('');
        });

        it('should work for chaining', () => {
            const resource = new TestResourceProperty({ properties: { key1: 'value1', key2: 'value2' } });
            resource.deleteProperty('key1').deleteProperty('key2');
            
            expect(resource.payload.properties?.key1).to.equal('');
            expect(resource.payload.properties?.key2).to.equal('');
        });
    });

    describe('getPropertyKeys', () => {
        it('should return empty array when no properties', () => {
            const resource = new TestResourceProperty({});
            expect(resource.getPropertyKeys()).to.deep.equal([]);
        });

        it('should return all property keys sorted alphabetically', () => {
            const resource = new TestResourceProperty({ 
                properties: { zebra: 'z', apple: 'a', banana: 'b' } 
            });
            expect(resource.getPropertyKeys()).to.deep.equal(['apple', 'banana', 'zebra']);
        });

        it('should only return own properties', () => {
            const resource = new TestResourceProperty({ properties: { key1: 'value1' } });
            expect(resource.getPropertyKeys()).to.deep.equal(['key1']);
        });
    });
});
